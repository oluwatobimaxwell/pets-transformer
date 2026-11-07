import numpy as np
import pandas as pd

from pets_engine.domain.field_label import FieldLabel
from pets_engine.transform.row_order import shuffled_positions
from pets_engine.verify.release_checks import row_order_check


def test_shuffle_depends_on_the_key_and_is_repeatable():
    frame = pd.DataFrame({"x": range(200)})
    one = shuffled_positions(frame, b"key-one", "t")
    assert (one == shuffled_positions(frame, b"key-one", "t")).all()
    assert not (one == shuffled_positions(frame, b"key-two", "t")).all()
    assert sorted(one) == list(range(200))


def test_conversations_move_as_blocks_and_keep_their_turn_order():
    frame = pd.DataFrame({"conversation": ["a", "a", "a", "b", "b", "c"], "turn": [1, 2, 3, 1, 2, 1]})
    shuffled = frame.iloc[shuffled_positions(frame, b"key", "turns", "conversation")]
    for _, turns in shuffled.groupby("conversation", sort=False):
        assert list(turns.turn) == sorted(turns.turn)
    runs = (shuffled.conversation != shuffled.conversation.shift()).sum()
    assert runs == 3


def test_gate_blocks_rows_left_in_time_order_and_passes_shuffled_ones():
    times = pd.DataFrame({"ts": pd.date_range("2025-01-01", periods=300, freq="h").astype(str)})
    labels = [FieldLabel("visits", "ts", "quasi_identifier", "TIMESTAMP", 0.9, "test")]
    in_order = row_order_check({"visits": times}, {"visits": times.index}, labels)
    shuffled = row_order_check({"visits": times}, {"visits": times.index[np.random.default_rng(1).permutation(300)]}, labels)
    assert not in_order.passed and shuffled.passed
