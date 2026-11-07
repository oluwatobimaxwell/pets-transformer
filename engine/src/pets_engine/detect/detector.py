"""Labels columns: strong value rules first, then a classifier trained on the public field catalogue."""
from __future__ import annotations

from importlib import resources
from pathlib import Path

import joblib
import numpy as np

from ..domain.column_profile import ColumnProfile
from ..domain.field_label import FieldLabel
from .evidence import describe_evidence, strong_evidence
from .features import UNINFORMATIVE_NAME, build_matrix
from .name_hints import name_hint

MODEL_FILE = "detector.joblib"
REVIEW_BELOW = 0.45
NAME_WEIGHT = 0.9
CONSERVATIVE_ROLE, CONSERVATIVE_SUBTYPE = "sensitive_attribute", "OTHER"


class ColumnDetector:
    def __init__(self, role_model, subtype_model):
        self.role_model = role_model
        self.subtype_model = subtype_model

    @classmethod
    def load(cls, path: Path | None = None) -> "ColumnDetector":
        target = path or Path(str(resources.files("pets_engine") / "models" / MODEL_FILE))
        if not target.exists():
            raise FileNotFoundError(f"No trained detector at {target}. Run `pets-engine train` first.")
        bundle = joblib.load(target)
        return cls(bundle["role"], bundle["subtype"])

    def label(self, profiles: list, use_names: bool = True) -> list:
        if not profiles:
            return []
        matrix = build_matrix(profiles, use_name=use_names)
        role_probs = self.role_model.predict_proba(matrix)
        subtypes = self.subtype_model.predict(matrix)
        return [self._label_one(p, role_probs[i], str(subtypes[i]), use_names) for i, p in enumerate(profiles)]

    def _label_one(self, profile: ColumnProfile, probs: np.ndarray, subtype: str, use_names: bool) -> FieldLabel:
        strong = strong_evidence(profile)
        if strong:
            role, strong_subtype, reason = strong
            return FieldLabel(profile.table, profile.column, role, strong_subtype, 0.99, "validator", [reason])
        hint = name_hint(profile.table, profile.column) if use_names else None
        blended = probs.copy()
        classes = list(self.role_model.classes_)
        if hint and hint.role in classes:
            blended[classes.index(hint.role)] += NAME_WEIGHT
            blended = blended / blended.sum()
        best = int(np.argmax(blended))
        role, confidence = classes[best], float(blended[best])
        if hint and hint.role == role:
            label = self._with_review_rule(profile, role, hint.subtype, confidence)
            label.reasons.insert(0, hint.reason)
            label.source = "name and values"
            return label
        return self._with_review_rule(profile, role, subtype, confidence)

    def _with_review_rule(self, profile: ColumnProfile, role: str, subtype: str, confidence: float) -> FieldLabel:
        reasons = describe_evidence(profile)
        hidden_name = bool(UNINFORMATIVE_NAME.match(profile.column))
        uncertain = confidence < REVIEW_BELOW or (hidden_name and role == "non_sensitive" and profile.distinct <= 12)
        if uncertain:
            reasons.append(f"model guessed {role} at {confidence:.0%}, so it counts as sensitive until a person checks it")
            return FieldLabel(profile.table, profile.column, CONSERVATIVE_ROLE, CONSERVATIVE_SUBTYPE, round(confidence, 3), "model",
                              reasons, needs_review=True, best_guess_role=role, best_guess_subtype=subtype)
        return FieldLabel(profile.table, profile.column, role, subtype, round(confidence, 3), "model", reasons)
