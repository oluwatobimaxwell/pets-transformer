import pandas as pd
import pytest


@pytest.fixture(autouse=True)
def engine_key(monkeypatch):
    monkeypatch.setenv("PETS_ENGINE_KEY", "test-only-key-not-a-real-secret")


@pytest.fixture
def visits():
    return pd.DataFrame({"visit_id": ["V1", "V2", "V3", "V4"], "patient": ["100276-932R", "100276-932R", "210814A966S", ""],
                         "ts": ["2025-01-01 09:07:00", "2025-01-02 10:15:00", "2025-01-03 11:30:00", "2025-01-04 12:45:00"]})
