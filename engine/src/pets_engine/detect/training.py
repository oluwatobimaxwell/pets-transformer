"""Trains the detector on the public catalogue and measures it honestly, one left-out dataset at a time."""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from scipy.sparse import vstack
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, recall_score

from pets_eval import io

from ..utils.tables import read_text_table
from .detector import ColumnDetector
from .features import build_matrix
from .profiler import profile_column

SAMPLE_ROWS = 20000
TREES = 300
SENSITIVE_ROLES = ["direct_identifier", "quasi_identifier", "sensitive_attribute", "technical_identifier", "free_text"]


def catalogue_examples(root: Path) -> tuple:
    catalogue = io.load_catalog(root)
    profiles, roles, subtypes, datasets = [], [], [], []
    tables: dict = {}
    for row in catalogue.itertuples():
        path = root / "data" / row.dataset / f"{row.table}.csv"
        if not path.exists():
            continue
        frame = tables.setdefault(path, read_text_table(path, SAMPLE_ROWS))
        if row.column not in frame.columns:
            continue
        profiles.append(profile_column(row.table, row.column, frame[row.column]))
        roles.append(row.privacy_role)
        subtypes.append(row.subtype or "OTHER")
        datasets.append(row.dataset)
    return profiles, np.array(roles), np.array(subtypes), np.array(datasets)


def new_forest() -> RandomForestClassifier:
    return RandomForestClassifier(n_estimators=TREES, class_weight="balanced_subsample", min_samples_leaf=1, n_jobs=-1, random_state=7)


def doubled_matrix(profiles: list):
    """Each column twice: with its name and without, so unnamed files still work."""
    return vstack([build_matrix(profiles, use_name=True), build_matrix(profiles, use_name=False)]).tocsr()


def fit_models(profiles: list, roles: np.ndarray, subtypes: np.ndarray) -> tuple:
    matrix = doubled_matrix(profiles)
    role_model = new_forest().fit(matrix, np.concatenate([roles, roles]))
    subtype_model = new_forest().fit(matrix, np.concatenate([subtypes, subtypes]))
    return role_model, subtype_model


def train_detector(root: Path, target: Path) -> dict:
    profiles, roles, subtypes, _ = catalogue_examples(root)
    role_model, subtype_model = fit_models(profiles, roles, subtypes)
    target.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"role": role_model, "subtype": subtype_model}, target, compress=3)
    return {"columns": len(profiles), "model": str(target)}


def evaluate_detector(root: Path) -> dict:
    """Leave one dataset out, so no score comes from a dataset the model trained on."""
    profiles, roles, subtypes, datasets = catalogue_examples(root)
    results = {}
    for use_name in (True, False):
        all_true, all_pred, all_sub, all_sub_pred = [], [], [], []
        for dataset in sorted(set(datasets)):
            held = datasets == dataset
            train_profiles = [p for p, h in zip(profiles, held) if not h]
            role_model, subtype_model = fit_models(train_profiles, roles[~held], subtypes[~held])
            test_profiles = [p for p, h in zip(profiles, held) if h]
            labels = ColumnDetector(role_model, subtype_model).label(test_profiles, use_names=use_name)
            all_true += list(roles[held])
            all_pred += [label.role for label in labels]
            all_sub += list(subtypes[held])
            all_sub_pred += [label.subtype for label in labels]
        true, pred = pd.Series(all_true), pd.Series(all_pred)
        per_role = {r: round(float(recall_score(true == r, pred == r)), 3) for r in sorted(set(all_true))}
        results["with_names" if use_name else "values_only"] = {
            "macro_f1": round(float(f1_score(true, pred, average="macro")), 3),
            "accuracy": round(float((true == pred).mean()), 3),
            "subtype_accuracy": round(float((pd.Series(all_sub) == pd.Series(all_sub_pred)).mean()), 3),
            "recall_by_role": per_role,
            "protect_recall": round(float(pred[true.isin(SENSITIVE_ROLES)].isin(SENSITIVE_ROLES).mean()), 3),
        }
    return results
