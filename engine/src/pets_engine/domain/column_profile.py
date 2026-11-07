"""What the profiler measured about one column."""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class ColumnProfile:
    table: str
    column: str
    rows: int
    blank_share: float
    distinct: int
    distinct_share: float
    mean_length: float
    max_length: int
    length_spread: float
    mean_tokens: float
    digit_share: float
    alpha_share: float
    numeric_share: float
    integer_share: float
    numeric_min: float
    numeric_max: float
    top_value_share: float
    top_shape_share: float
    shape_count: int
    pattern_shares: dict = field(default_factory=dict)
    # 5th, 50th and 95th percentile of the years, for columns of dates; zeros otherwise
    year_low: int = 0
    year_mid: int = 0
    year_high: int = 0

    @property
    def key(self) -> str:
        return f"{self.table}.{self.column}"
