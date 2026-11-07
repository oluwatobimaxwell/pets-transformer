"""Pairs each column with a PET. It reads labels, the scenario and the policy, and never reads raw values."""
from __future__ import annotations

from ..domain.field_label import FieldLabel
from ..domain.pet_choice import PetChoice
from ..domain.scenario import Scenario
from ..utils.policy import policy

REMOVE, KEEP, PSEUDONYM, GENERALISE = "remove", "keep", "keyed_pseudonym", "generalise"
BIRTH_SUBTYPES = ("BIRTH_DATE",)


def technique_rules() -> dict:
    """The policy's technique for each role, and the subtypes that override it, for anyone who needs to explain a choice."""
    rules = policy()
    return {"roles": dict(rules["needed_columns"]), "subtypes": dict(rules["subtype_overrides"])}


def technique_for(role: str, subtype: str) -> str:
    """The technique a needed column gets: its subtype's override if there is one, otherwise its role's rule."""
    rules = technique_rules()
    return rules["subtypes"].get(subtype) or rules["roles"][role]


def _why(label: FieldLabel, pet: str, scenario: Scenario) -> str:
    return f"{label.role.replace('_', ' ')} ({label.subtype}), kept for {scenario.id}, so the rule applies {pet.replace('_', ' ')}"


def _scenario_keeps(scenario: Scenario) -> list:
    return policy()["scenario_overrides"].get(scenario.id, {}).get("also_keep", [])


def choice_for_needed(label: FieldLabel, scenario: Scenario, time_ordered: set, tasks: list) -> PetChoice:
    if label.key in time_ordered:
        return PetChoice(label.table, label.column, PSEUDONYM, "its order follows arrival time, so a raw key would reveal when each record happened",
                         output_column=label.column, needed_by=tasks)
    pet = technique_for(label.role, label.subtype)
    tunable = pet == GENERALISE
    output = "age" if label.subtype in BIRTH_SUBTYPES else label.column
    return PetChoice(label.table, label.column, pet, _why(label, pet, scenario), params={"subtype": label.subtype}, output_column=output,
                     needed_by=tasks, tunable=tunable)


def select_pets(labels: list, needed: dict, scenario: Scenario, time_ordered: set, needed_by: dict) -> list:
    keep_extra = set(_scenario_keeps(scenario))
    choices = []
    for label in labels:
        if label.table not in needed:
            choices.append(PetChoice(label.table, label.column, REMOVE, "no required task uses this table, so it is withheld"))
        elif label.column in needed[label.table] or label.key in keep_extra:
            choices.append(choice_for_needed(label, scenario, time_ordered, needed_by.get(label.key, [])))
        else:
            choices.append(PetChoice(label.table, label.column, REMOVE, "no required task uses this column, so it is removed"))
    return choices
