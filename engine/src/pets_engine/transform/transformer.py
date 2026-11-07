"""Applies a plan to the tables. It builds the release and leaves every keep-or-drop decision to Select and Tune."""
from __future__ import annotations

import pandas as pd

from ..domain.pet_choice import PetChoice
from ..tune.levels import apply_level
from . import pets


class Transformer:
    def __init__(self, tables: dict, plan: list, key: bytes, text_columns: dict | None = None):
        self.tables = tables
        self.plan = plan
        self.key = key
        self.text_columns = text_columns or {}
        self._fixed: dict = {}
        self._dialled: dict = {}

    def use_plan(self, plan: list) -> None:
        self.plan = plan

    def fixed_column(self, choice: PetChoice) -> pd.Series:
        """Non-dial columns only need computing once."""
        if choice.key not in self._fixed:
            self._fixed[choice.key] = self._apply_fixed(choice, self.tables[choice.table][choice.column])
        return self._fixed[choice.key]

    def dialled_column(self, choice: PetChoice, level: str) -> pd.Series:
        slot = (choice.key, level)
        if slot not in self._dialled:
            self._dialled[slot] = apply_level(self.tables[choice.table][choice.column], level, choice.params["subtype"])
        return self._dialled[slot]

    def _apply_fixed(self, choice: PetChoice, series: pd.Series) -> pd.Series:
        if choice.pet == "keyed_pseudonym":
            return pets.keyed_pseudonym(series, self.key)
        if choice.pet == "prefix_ip":
            return pets.prefix_ip(series, self.key)
        if choice.pet == "shorten_code":
            return pets.shorten_code(series, choice.params.get("length", 3))
        if choice.pet == "redact_text":
            return self.text_columns.get(choice.key, pd.Series("", index=series.index))
        return series

    def build(self, levels: dict) -> dict:
        release = {}
        for table in self.tables:
            kept = [c for c in self.plan if c.table == table and c.pet != "remove"]
            if not kept:
                continue
            frame = pd.DataFrame(index=self.tables[table].index)
            for choice in kept:
                if choice.tunable:
                    frame[choice.output_column] = self.dialled_column(choice, levels[choice.params["subtype"]])
                else:
                    frame[choice.output_column] = self.fixed_column(choice)
            release[table] = frame
        return release
