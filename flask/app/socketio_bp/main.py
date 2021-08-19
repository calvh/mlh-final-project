import os
from pathlib import Path
from collections import deque

from flask import request, session
from flask_socketio import emit, rooms, leave_room, close_room

from app.socketio_bp.utils.name_generator import get_anon_name
from app.socketio_init import socketio

# keep track of connected clients (socket ids) for reference in queue
# sid: username
clients = {}

# keep track of names and their socket ids
# username: sid
names = {}

# use queue to put clients into rooms
queue = deque()

# tracker to generate numbers anonymous names
animals_count = {}

# load list of animals into memory
FILE = os.path.join(Path(__file__).resolve().parent, "utils/animals.txt")

with open(FILE) as f:
    animals = f.read().splitlines()


@socketio.on("connect")
def handle_connect(auth):
    sid = request.sid

    username = session.get("username")

    if names.get(username):
        emit("already logged in", username)
        # registered user who already has open socket id: reject connection
        return False

    # anonymous user OR registered user with no existing socket connections
    if not username:
        username = get_anon_name(animals, animals_count)

    clients[sid] = username
    names[username] = sid

    emit("connected", username)
    emit("general notification", f"{username} is online", broadcast=True)


@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid

    username = session.get("username", clients[sid])

    del clients[sid]
    del names[username]

    for room in rooms():
        emit("room notification", f"{username} is offline", to=room)
        emit("opponent left", to=room)
        close_room(room)


@socketio.on("leave room")
def on_leave(data):

    sid = request.sid

    username = session.get("username", clients[sid])

    for room in rooms():
        leave_room(room)

        # notify user of successful exit
        emit("user notification", f"Left {room}")
        emit("left room")

        # notify room that a user has left
        emit("room notification", f"{username} left the room", to=room)
        emit("opponent left", to=room)
        close_room(room)
