import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    tester = app.test_client()
    yield tester


def test_index(client):
    response = client.get("/", content_type="html/text")
    assert response.status_code == 200


def test_play(client):
    response = client.get("/play", content_type="html/text")
    assert response.status_code == 200


def test_login(client):
    response = client.get("/auth/login/", content_type="html/text")
    assert response.status_code == 200


def test_register(client):
    response = client.get("/auth/register/", content_type="html/text")
    assert response.status_code == 200


def test_stats(client):
    response = client.get("/stats", content_type="html/text")
    assert response.status_code == 401


def test_404(client):
    response = client.get("/oops/", content_type="html/text")
    assert response.status_code == 404
