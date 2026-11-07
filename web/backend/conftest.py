"""Shared pytest setup: a throwaway workspace and key, set before the app reads its settings."""

import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
os.environ["WORKSPACE_DIR"] = tempfile.mkdtemp()
os.environ["PETS_ENGINE_KEY"] = "test-only-key-not-a-real-secret"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture
def api_client() -> TestClient:
    return TestClient(app)
