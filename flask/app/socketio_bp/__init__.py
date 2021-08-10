from flask import Blueprint

socketio_bp = Blueprint("socketio_bp", __name__)

from app.socketio_bp import events
