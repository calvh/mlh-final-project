from pathlib import Path
import pytest
from app import app


@pytest.fixture
def client():
    tester = app.test_client()
    yield tester


def test_index(client):
    response = client.get("/", content_type="html/text")
    assert response.status_code == 200


def test_play(client):
    response = client.get("/play/", content_type="html/text")
    assert response.status_code == 200


def test_stats(client):
    response = client.get("/stats/", content_type="html/text")
    assert response.status_code == 200


def test_scores(client):
    response = client.get("/scores/", content_type="html/text")
    assert response.status_code == 200


def test_404(client):
    response = client.get("/oops/", content_type="html/text")
    assert response.status_code == 404