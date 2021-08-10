import os
import uuid
from collections import deque

from flask import request, session
from flask_socketio import send, emit, rooms, join_room, leave_room

from app.socketio_init import socketio

# keep track of connected clients for reference in queue
clients = set()

# use queue to push clients into rooms
queue = deque()


@socketio.on("connect")
def handle_connect(auth):
    sid = request.sid

    # TODO confirm that this works for logged in users
    username = session.get("username", sid)

    emit("general notification", f"{username} CONNECTED", broadcast=True)

    clients.add(sid)


@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid
    clients.remove(sid)

    for room in rooms():
        emit("room notification", f"{sid} DISCONNECTED", to=room)


@socketio.on("queue")
def handle_queue():
    sid = request.sid

    # prevent duplicate queuing
    if len(rooms()) > 1:
        return emit("user notification", "Already in a room!")

    queue.append(sid)
    players = set()

    while len(players) < 2:
        try:
            players.add(queue.popleft())
        except IndexError:
            break

    # failed to find match for last player, requeue
    if len(players) < 2:
        last = players.pop()
        queue.append(last)
        emit(
            "status change",
            {"status": "Waiting for players to join..."},
            to=last,
        )
        return emit(
            "user notification", "Waiting for players to join...", to=last
        )

    # match found
    player1 = players.pop()
    player2 = players.pop()

    room_id = uuid.uuid4().hex

    # TODO investigate if this is necessary
    # check for collision with existing socket ids
    while room_id in clients:
        room_id = uuid.uuid4().hex

    join_room(room_id, sid=player1)
    join_room(room_id, sid=player2)

    emit("status change", {"status": f"In game with {player2}"}, to=player1)
    emit("status change", {"status": f"In game with {player1}"}, to=player2)

    emit("room notification", f"{player1} JOINED", to=room_id)
    emit("room notification", f"{player2} JOINED", to=room_id)

    emit("user notification", f"Joined room {room_id}", to=player1)
    emit("user notification", f"Joined room {room_id}", to=player2)
    emit("joined room", {"room": room_id, "opponent": player2}, to=player1)
    emit("joined room", {"room": room_id, "opponent": player1}, to=player2)


@socketio.on("general chat")
def handle_general_chat(data):
    sid = request.sid
    username = session.get("username", sid)
    data["username"] = username
    send(data, broadcast=True)


@socketio.on("room chat")
def handle_room_chat(data):
    # send named event so frontend can handle separately from general messages
    # check if client is in room
    if data["room"] in rooms():
        sid = request.sid
        username = session.get("username", sid)
        data["username"] = username
        emit("room chat", data, to=data["room"])


# leave room
@socketio.on("leave")
def on_leave(data):

    sid = request.sid
    room = data["room"]
    leave_room(room)

    # notify user of successful exit
    emit("user notification", f"Left {room}")
    emit("status change", {"status": "CONNECTED"})

    # notify room that a user has left
    emit("room notification", f"{sid} LEFT", to=room)
