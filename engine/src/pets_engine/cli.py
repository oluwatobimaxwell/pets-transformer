"""Command line. It parses arguments, calls the engine and prints the outcome."""
from __future__ import annotations

import argparse
import json
import sys
import webbrowser
from pathlib import Path

from pets_eval import io

from . import __version__
from .detect.detector import MODEL_FILE, ColumnDetector
from .detect.labelling import label_tables
from .detect.training import evaluate_detector, train_detector
from .domain.run_config import RunConfig
from .pipeline import run_release
from .report.console import print_labels, print_result, write_labels
from .report.dashboard import write_dashboard
from .text.evaluation import evaluate_text
from .utils.package import custom_scenario, load_scenario, package_root
from .utils.submission import build_submission
from .utils.tables import read_text_tables


def _root(args) -> Path:
    root = package_root(args.package, Path(getattr(args, "data", ".") or "."))
    if root is None:
        raise SystemExit("Can't find the challenge package. Pass --package or set PETS_ROOT.")
    return root


def cmd_scenarios(args) -> int:
    for raw in io.load_scenarios(_root(args)):
        print(f"{raw['id']:<11} {raw['trust_level']:<20} {raw['title']}")
    return 0


def cmd_train(args) -> int:
    target = Path(__file__).parent / "models" / MODEL_FILE
    print(json.dumps(train_detector(_root(args), target), indent=1))
    return 0


def cmd_evaluate(args) -> int:
    print(json.dumps(evaluate_detector(_root(args)), indent=1))
    return 0


def cmd_evaluate_text(args) -> int:
    print(json.dumps(evaluate_text(_root(args)), indent=1))
    return 0


def cmd_detect(args) -> int:
    data = Path(args.data)
    labels = label_tables(read_text_tables(data), ColumnDetector.load())
    if args.out:
        write_labels(labels, data.name, Path(args.out))
    print_labels(labels)
    return 0


def cmd_run(args) -> int:
    data = Path(args.data)
    root = package_root(args.package, data)
    if args.scenario:
        if root is None:
            raise SystemExit("--scenario needs the challenge package. Pass --package or use --trust for your own data.")
        scenario = load_scenario(args.scenario, root)
    else:
        scenario = custom_scenario(data.name, args.trust)
        root = None
    keep = tuple(item for item in (args.keep or "").split(",") if item)
    config = RunConfig(data, Path(args.out), scenario, root, Path(args.review) if args.review else None, keep)
    result = run_release(config, lambda stage, message: print(f"[{stage}] {message}", file=sys.stderr))
    print_result(result)
    return result.exit_code


def cmd_dashboard(args) -> int:
    target = write_dashboard(Path(args.run))
    print(target)
    if args.open:
        webbrowser.open(target.resolve().as_uri())
    return 0


def cmd_submission(args) -> int:
    runs = dict(item.split("=", 1) for item in args.run or [])
    print(json.dumps(build_submission(_root(args), Path(args.out), {dataset: Path(run) for dataset, run in runs.items()}), indent=1))
    return 0


def parser() -> argparse.ArgumentParser:
    top = argparse.ArgumentParser(prog="pets-engine", description="Protect a dataset for a named recipient, or refuse to release it.")
    top.add_argument("--version", action="version", version=__version__)
    sub = top.add_subparsers(dest="command", required=True)
    for name, handler, words in (("scenarios", cmd_scenarios, "List sharing scenarios"), ("train", cmd_train, "Train the column detector"),
                                 ("evaluate", cmd_evaluate, "Score the detector on left-out datasets"),
                                 ("evaluate-text", cmd_evaluate_text, "Score redaction on held-out and never-tuned text")):
        one = sub.add_parser(name, help=words)
        one.add_argument("--package", help="Challenge package folder")
        one.set_defaults(handler=handler)
    detect = sub.add_parser("detect", help="Label every column in a folder of CSV files")
    detect.add_argument("data")
    detect.add_argument("--out", help="Write labels as CSV")
    detect.set_defaults(handler=cmd_detect)
    run = sub.add_parser("run", help="Run the full pipeline. Exit codes: 0 released, 2 needs review, 3 blocked")
    run.add_argument("data")
    run.add_argument("--out", required=True)
    choice = run.add_mutually_exclusive_group(required=True)
    choice.add_argument("--scenario", help="Scenario id, such as HEALTH-S1")
    choice.add_argument("--trust", choices=["internal", "controlled_research", "contractual", "public"], help="Trust level for data outside the package")
    run.add_argument("--package", help="Challenge package folder")
    run.add_argument("--review", help="JSON file of a person's decisions")
    run.add_argument("--keep", help="Comma-separated table.column list to keep, for data outside the package")
    run.set_defaults(handler=cmd_run)
    dashboard = sub.add_parser("dashboard", help="Write the evidence dashboard for an existing run")
    dashboard.add_argument("run", help="Run folder, such as runs/health-s1")
    dashboard.add_argument("--open", action="store_true", help="Open it in the browser")
    dashboard.set_defaults(handler=cmd_dashboard)
    submission = sub.add_parser("submission", help="Build the pets_submission folder for organiser checks")
    submission.add_argument("--package")
    submission.add_argument("--out", default="pets_submission")
    submission.add_argument("--run", action="append", help="dataset=run_folder of a released run. Row maps are copied, so share this folder with the organisers only")
    submission.set_defaults(handler=cmd_submission)
    return top


def main(argv=None) -> int:
    args = parser().parse_args(argv)
    try:
        return args.handler(args)
    except (ValueError, FileNotFoundError) as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1
