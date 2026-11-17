"""Playwright HTTP API smoke for the LOCAL mocked Worker HTTP harness, not a deployed Worker."""
import os
from playwright.sync_api import sync_playwright

base = os.getenv("DISTRIBUTION_LOCAL_URL", "http://127.0.0.1:8799")
headers = {"Authorization": "Bearer local-council-token-at-least-24-characters"}
with sync_playwright() as p:
    client = p.request.new_context(base_url=base)
    assert client.get("/api/v1/skills").status == 401
    inventory = client.get("/api/v1/skills", headers=headers)
    assert inventory.status == 200
    assert inventory.json()["kernel_status"] == "draft"
    latest = client.get("/api/v1/skills/juss-os/latest", headers=headers)
    assert latest.status == 200 and latest.json()["status"] == "draft"
    accepted = client.get("/api/v1/acceptance", headers=headers)
    assert accepted.status == 200 and accepted.json()["kernel"]["founder_accepted"] is False
    validation = client.post("/api/v1/validate", headers=headers, data={"skill_name": "juss-os", "expected_status": "draft"})
    assert validation.status == 200 and validation.json()["valid"] is True
    bad_sha = client.get("/api/v1/skills/juss-os/sha/abc1234", headers=headers)
    assert bad_sha.status == 400
    print("Playwright local HTTP API smoke: 6/6 assertions passed")
    client.dispose()
