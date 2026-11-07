"""Writes a scenario file for a person to fill in, listing every column Detect found so they can pick from them."""
from __future__ import annotations

TEMPLATE = """# Scenario for {dataset}. Fill this in, then run:
#   pets-engine run <data folder> --scenario-file scenario.yaml --out runs/<name>
id: {dataset_id}-1
recipient: Who will receive the data
purpose: What they will use it for
trust_level: contractual        # internal, controlled_research, contractual or public
k: 5                            # every released row must look like at least this many others

# The questions the recipient must still be able to answer. Only columns these need are released.
# Kinds: median, mean, count (needs `by`), correlation (two columns), distribution.
questions:
  - ask: An example question in plain words
    median: table.column
    by: [table.column]

# Columns Detect found:
{columns}
"""


def scenario_template(dataset: str, labels: list) -> str:
    lines = [f"#   {label.key:<40} {label.role.replace('_', ' ')}, {label.subtype}" + ("  (unsure)" if label.needs_review else "") for label in labels]
    return TEMPLATE.format(dataset=dataset, dataset_id=dataset.upper().replace("_", "-"), columns="\n".join(lines))
