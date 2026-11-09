"""The API end to end: register data, see what Detect found, run a release, and download only what may leave."""

import io
import time

SAMPLE_CSV = "name,email,status\n" + "".join(f"Aino Virtanen{i},aino{i}@kotiposti.example,{'open' if i % 2 else 'closed'}\n" for i in range(40))


def upload(client):
    response = client.post("/api/datasets/", files=[("files", ("tickets.csv", io.BytesIO(SAMPLE_CSV.encode()), "text/csv"))])
    assert response.status_code == 201, response.text
    return response.json()


def wait(client, run_id, seconds=120):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        run = client.get(f"/api/runs/{run_id}/").json()
        if run["status"] not in ("queued", "running"):
            return run
        time.sleep(0.5)
    raise AssertionError("run did not finish")


def test_an_upload_is_detected_and_released_without_its_identifiers(api_client):
    dataset = upload(api_client)
    assert dataset["tables"][0]["columns"] == ["name", "email", "status"]
    columns = {c["column"]: c for c in api_client.get(f"/api/datasets/{dataset['id']}/columns/").json()}
    assert columns["email"]["role"] == "direct_identifier"
    started = api_client.post("/api/runs/", json={"dataset_id": dataset["id"], "custom": {
        "recipient": "Support analysts", "trust_level": "contractual",
        "questions": [{"kind": "count", "by": ["tickets.status"]}]}})
    assert started.status_code == 202, started.text
    run = wait(api_client, started.json()["id"])
    assert run["status"] == "release", run
    assert run["summary"]["tasks"][0]["score"] == 1.0
    release = api_client.get(f"/api/runs/{run['id']}/download/release/")
    assert release.status_code == 200 and release.headers["content-type"] == "application/zip"
    assert b"kotiposti" not in release.content
    evidence = api_client.get(f"/api/runs/{run['id']}/evidence/").json()
    assert evidence["status"] == "release" and evidence["records"]["tables"] == ["tickets"]
    table = api_client.get(f"/api/runs/{run['id']}/records/tickets/").json()
    assert table["total"] == 40 and b"kotiposti" not in str(table["rows"]).encode()
    assert api_client.get(f"/api/runs/{run['id']}/records/private/").status_code == 404


def test_private_files_and_other_folders_cannot_be_downloaded(api_client):
    dataset = upload(api_client)
    run = api_client.post("/api/runs/", json={"dataset_id": dataset["id"], "custom": {"recipient": "x", "trust_level": "contractual"}}).json()
    assert api_client.get(f"/api/runs/{run['id']}/download/private/").status_code == 404


def test_ids_that_could_reach_other_folders_are_refused(api_client):
    assert api_client.get("/api/datasets/..%2F..%2Fetc/").status_code == 404
    assert api_client.get("/api/runs/not-an-id/").status_code == 404


def test_only_csv_files_are_accepted(api_client):
    response = api_client.post("/api/datasets/", files=[("files", ("notes.txt", io.BytesIO(b"hello"), "text/plain"))])
    assert response.status_code == 400


def test_a_run_needs_a_scenario(api_client):
    dataset = upload(api_client)
    assert api_client.post("/api/runs/", json={"dataset_id": dataset["id"]}).status_code == 400


def test_bad_questions_come_back_as_a_readable_error(api_client):
    dataset = upload(api_client)
    response = api_client.post("/api/runs/", json={"dataset_id": dataset["id"], "custom": {
        "recipient": "x", "trust_level": "contractual", "questions": [{"kind": "count"}]}})
    assert response.status_code == 400 and "by" in response.json()["detail"]


def datasets_on_disk():
    from app.config import settings
    root = settings.workspace / "datasets"
    return set(root.iterdir()) if root.exists() else set()


def post_files(client, *files):
    return client.post("/api/datasets/", files=[("files", (name, io.BytesIO(content), "text/csv")) for name, content in files])


def test_an_empty_file_is_refused_with_a_reason_and_leaves_nothing_behind(api_client):
    before = datasets_on_disk()
    response = post_files(api_client, ("empty.csv", b""))
    assert response.status_code == 400 and "empty" in response.json()["detail"]
    assert datasets_on_disk() == before


def test_a_file_not_saved_as_utf8_gets_a_reason_not_a_server_error(api_client):
    latin1 = "name,city\nAino,Jyväskylä\n".encode("latin-1")  # what Excel's plain "CSV" export writes
    before = datasets_on_disk()
    response = post_files(api_client, ("visits.csv", latin1))
    assert response.status_code == 400 and "UTF-8" in response.json()["detail"]
    assert datasets_on_disk() == before


def test_a_utf8_file_from_excel_is_accepted(api_client):
    response = post_files(api_client, ("visits.csv", "﻿name,city\nAino,Jyväskylä\n".encode("utf-8")))
    assert response.status_code == 201, response.text
    assert response.json()["tables"][0]["columns"] == ["name", "city"]


def test_two_files_that_would_become_one_table_are_refused(api_client):
    for names in (("ed visits.csv", "ed_visits.csv"), ("data.csv", "DATA.csv")):
        response = post_files(api_client, (names[0], b"a\n1\n"), (names[1], b"b\n2\n"))
        assert response.status_code == 400 and "Rename one" in response.json()["detail"], response.text


def test_a_run_cut_off_by_a_restart_is_reported_as_failed(api_client):
    from app.config import settings
    from app.services.run_job import RunJob
    run_id = "0123456789ab"  # on disk only, as after the server that ran it stopped
    job = RunJob(run_id, "abcdefabcdef", "HEALTH-S1", settings.workspace / "runs" / run_id, status="running")
    job.save()
    run = api_client.get(f"/api/runs/{run_id}/").json()
    assert run["status"] == "error" and "stopped" in run["error"]
    assert any(item["id"] == run_id and item["status"] == "error" for item in api_client.get("/api/runs/").json())
