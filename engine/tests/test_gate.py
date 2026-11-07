from pathlib import Path

import pandas as pd

from pets_engine.domain.check import BLOCK, REVIEW, Check
from pets_engine.domain.pet_choice import PetChoice
from pets_engine.domain.verdict import Verdict
from pets_engine.tune.k_check import share_below_k
from pets_engine.tune.suppression import linked_keep_masks, rows_to_keep
from pets_engine.verify import release_checks


def test_any_block_beats_a_review():
    verdict = Verdict(1, [Check("a", False, REVIEW, ""), Check("b", False, BLOCK, "")])
    assert verdict.status == "block"


def test_review_holds_the_release():
    assert Verdict(1, [Check("a", False, REVIEW, "")]).status == "review"


def test_clean_checks_release():
    assert Verdict(1, [Check("a", True, BLOCK, "")]).status == "release"


def test_k_check_counts_small_groups():
    frame = pd.DataFrame({"age": ["40-49"] * 5 + ["90+"], "area": ["other"] * 6})
    assert round(share_below_k(frame, ["age", "area"], 5), 3) == round(1 / 6, 3)


def test_suppression_reaches_linked_tables():
    visits = pd.DataFrame({"id": ["a", "b"]})
    labs = pd.DataFrame({"id": ["a", "a", "b"]})
    masks = linked_keep_masks({"visits": visits, "labs": labs}, "visits", "id", pd.Series([True, False]))
    assert masks["labs"].tolist() == [True, True, False]


def test_rows_below_k_are_dropped():
    frame = pd.DataFrame({"age": ["40-49"] * 5 + ["90+"]})
    assert rows_to_keep(frame, ["age"], 5).sum() == 5


def test_row_maps_in_a_release_are_caught(tmp_path: Path):
    (tmp_path / "rowmap_visits.csv").write_text("protected_row,original_record_id\n0,V1\n")
    assert not release_checks.private_files_check(tmp_path).passed


def test_a_leftover_id_blocks_the_release(tmp_path: Path):
    (tmp_path / "visits.csv").write_text("note\nsoita aino.v@kotiposti.example\n")
    check = release_checks.leftover_identifiers_check(tmp_path, [])
    assert not check.passed and check.severity == BLOCK


def test_a_technique_that_did_nothing_is_caught():
    originals = {"t": pd.DataFrame({"ip": ["10.0.0.1", "10.0.0.2"]})}
    plan = [PetChoice("t", "ip", "prefix_ip", "test", output_column="ip")]
    assert not release_checks.protected_values_check(originals, {"t": originals["t"]}, plan).passed
