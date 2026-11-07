"""Runs the real pipeline on a small folder of data outside the challenge package."""
import json
from pathlib import Path

import pandas as pd

from pets_engine.domain.run_config import RunConfig
from pets_engine.pipeline import run_release
from pets_engine.utils.package import custom_scenario


def small_folder(path: Path) -> Path:
    folder = path / "demo"
    folder.mkdir()
    pd.DataFrame({"customer_name": [f"Aino Virtanen{i}" for i in range(40)], "email": [f"aino{i}@kotiposti.example" for i in range(40)],
                  "status": ["open", "closed"] * 20}).to_csv(folder / "tickets.csv", index=False)
    return folder


def test_private_data_is_held_or_removed_and_evidence_is_written(tmp_path):
    config = RunConfig(small_folder(tmp_path), tmp_path / "run", custom_scenario("demo", "contractual"))
    result = run_release(config)
    manifest = json.loads((tmp_path / "run" / "evidence" / "manifest.json").read_text())
    pets = {field["field"]: field["pet"] for field in manifest["fields"]}
    assert pets["tickets.email"] == "remove" and pets["tickets.customer_name"] == "remove"
    assert (tmp_path / "run" / "evidence" / "report.md").exists()
    assert result.status in ("release", "review")


def test_public_recipient_gets_no_row_level_release(tmp_path):
    config = RunConfig(small_folder(tmp_path), tmp_path / "run", custom_scenario("demo", "public"))
    result = run_release(config)
    assert result.status == "block" and result.exit_code == 3
    assert not (tmp_path / "run" / "release").exists()


def test_dashboard_shows_protected_rows_but_no_original_identifiers(tmp_path):
    folder = small_folder(tmp_path)
    run_release(RunConfig(folder, tmp_path / "run", custom_scenario("demo", "contractual"), keep=("tickets.status",)))
    page = (tmp_path / "run" / "evidence" / "dashboard.html").read_text()
    assert "aino0@kotiposti.example" not in page and "Aino Virtanen0" not in page
    assert '"name": "status"' in page and "rowmap" not in page.split("<script type")[1].split("</script>")[0]


def test_a_written_scenario_runs_end_to_end_with_its_own_questions(tmp_path):
    from pets_engine.utils.scenario_file import load_scenario_file
    folder = small_folder(tmp_path)
    spec = tmp_path / "scenario.yaml"
    spec.write_text("trust_level: contractual\nquestions:\n  - count: true\n    by: [tickets.status]\n")
    result = run_release(RunConfig(folder, tmp_path / "run", load_scenario_file(spec, "demo")))
    manifest = json.loads((tmp_path / "run" / "evidence" / "manifest.json").read_text())
    assert manifest["tasks"][0]["id"] == "Q1" and manifest["tasks"][0]["score"] == 1.0
    assert {f["field"]: f["pet"] for f in manifest["fields"]}["tickets.email"] == "remove"
    assert result.status == "release"
