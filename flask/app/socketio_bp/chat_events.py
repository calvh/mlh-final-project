from flask import request, session
from flask_socketio import send, emit, rooms

from app.socketio_bp.main import clients
from app.socketio_init import socketio


@socketio.on("general chat")
def handle_general_chat(data):
    sid = request.sid
    username = session.get("username", clients[sid])
    data["username"] = username
    send(data, broadcast=True)


@socketio.on("room chat")
def handle_room_chat(data):
    # send named event so frontend can handle separately from general messages
    # check if client is in room
    if data["room"] in rooms():
        sid = request.sid
        username = session.get("username", clients[sid])
        data["username"] = username
        emit("room chat", data, to=data["room"])
