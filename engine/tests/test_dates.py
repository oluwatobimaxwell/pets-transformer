"""Columns Detect calls a time can hold values no date reader understands; they must not stop a run."""
import pandas as pd

from pets_engine.utils.dates import ages_from_birth, to_moments


def test_school_years_and_ancient_dates_become_missing_instead_of_failing():
    moments = to_moments(pd.Series(["2022-23", "2023-24", "2025-01-03 10:15"]))
    assert len(moments) == 3 and moments.iloc[2] == pd.Timestamp("2025-01-03 10:15")
    assert to_moments(pd.Series(["0001-09-27", "2025-02-01"])).iloc[1] == pd.Timestamp("2025-02-01")


def test_ages_still_come_from_readable_birth_dates():
    ages = ages_from_birth(pd.Series(["1990-06-15", "0001-01-01"]))
    assert 35 <= ages.iloc[0] <= 36
