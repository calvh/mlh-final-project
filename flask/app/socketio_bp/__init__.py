from flask import Blueprint
from app.socketio_bp import main, game_events, chat_events

socketio_bp = Blueprint("socketio_bp", __name__)

# fix Flake8 see:
# stackoverflow.com/questions/31079047/python-pep8-class-in-init-imported-but-not-used

__all__ = ["main", "game_events", "chat_events"]
