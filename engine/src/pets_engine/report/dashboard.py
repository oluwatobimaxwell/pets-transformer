"""Writes the dashboard: one self-contained HTML file next to the evidence, safe to share like the rest of it."""
from __future__ import annotations

import json
from importlib import resources
from pathlib import Path

from ..domain.run_paths import RunPaths
from .dashboard_data import dashboard_data

PLACEHOLDER = "/*__DASHBOARD_DATA__*/null"


def render_dashboard(data: dict) -> str:
    template = (resources.files("pets_engine") / "report" / "templates" / "dashboard.html").read_text(encoding="utf-8")
    payload = json.dumps(data, ensure_ascii=False, default=str).replace("</", "<\\/")
    return template.replace(PLACEHOLDER, payload)


def write_dashboard(run_dir: Path) -> Path:
    target = RunPaths(Path(run_dir)).evidence / "dashboard.html"
    target.write_text(render_dashboard(dashboard_data(Path(run_dir))), encoding="utf-8")
    return target
