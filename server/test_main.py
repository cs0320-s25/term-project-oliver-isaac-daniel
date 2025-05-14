from fastapi.testclient import TestClient
import pytest
from main import app
from data import get_all_courses

client = TestClient(app)

def test_score_endpoint():
    # Mock request payload
    payload = {
        "user_blurb": "I love programming and data science.",
        "pref_departments": ["CS", "MATH"],
        "num_courses": 5,
        "alpha": 0.5
    }

    # Send POST request to the /score endpoint
    response = client.post("/score", json=payload)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response structure
    response_json = response.json()
    assert "results" in response_json
    assert isinstance(response_json["results"], list)

    # Assert the structure of each course in the results
    for course in response_json["results"]:
        assert "course" in course
        assert "id" in course
        assert "score" in course
        assert "description" in course
        assert isinstance(course["course"], str)
        assert isinstance(course["id"], str)
        assert isinstance(course["score"], float)
        assert isinstance(course["description"], str)

def test_score_endpoint_with_defaults():
    # Only user_blurb, others should use defaults (pref_departments=[], num_courses=10, alpha=0.5)
    payload = {"user_blurb": "anything goes"}
    r = client.post("/score", json=payload)
    assert r.status_code == 200
    data = r.json()
    results = data["results"]
    # default num_courses is 10
    assert len(results) <= 10
    # ensure they're sorted descending by score
    scores = [item["score"] for item in results]
    assert all(scores[i] >= scores[i + 1] for i in range(len(scores) - 1))


def test_zero_num_courses_returns_empty_list():
    payload = {"user_blurb": "test", "num_courses": 0}
    r = client.post("/score", json=payload)
    assert r.status_code == 200
    assert r.json()["results"] == []


def test_too_large_num_courses_clamps_to_available():
    total = len(get_all_courses())
    payload = {"user_blurb": "test", "num_courses": total + 100}
    r = client.post("/score", json=payload)
    assert r.status_code == 200
    results = r.json()["results"]
    assert len(results) == total


@pytest.mark.parametrize("bad_payload", [
    {},  # completely empty
    {"pref_departments": ["CS"]},  # missing user_blurb
    {"user_blurb": 123},  # wrong type
    {"user_blurb": "hi", "alpha": "not_a_float"},
])
def test_score_endpoint_invalid_payload(bad_payload):
    r = client.post("/score", json=bad_payload)
    assert r.status_code == 422

def test_cors_headers_on_score_endpoint():
    # Proper CORS preflight requires Origin + Access-Control-Request-Method headers
    headers = {
        "Origin": "http://localhost:8000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
    }
    r = client.options("/score", headers=headers)
    # Should be handled by CORSMiddleware, not 405
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-origin") == "http://localhost:8000"
    methods = r.headers.get("access-control-allow-methods", "")
    assert "POST" in methods


def test_no_extra_keys_in_each_result():
    payload = {"user_blurb": "anything"}
    r = client.post("/score", json=payload)
    assert r.status_code == 200
    for item in r.json()["results"]:
        assert set(item.keys()) == {"course", "id", "score", "description"}