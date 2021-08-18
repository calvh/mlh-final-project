import uuid
from flask import request
from flask_socketio import emit, rooms, join_room

from app.socketio_bp.main import clients, queue

from app.socketio_init import socketio


# queue/join room
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
            popped = queue.popleft()

            # handle disconnected clients
            if popped in clients:
                players.add(popped)

        except IndexError:
            break

    # failed to find match for last player, requeue
    if len(players) == 1:
        last = players.pop()
        queue.append(last)
        return emit(
            "user notification", "Waiting for players to join...", to=last
        )

    # match found
    player1 = players.pop()
    player2 = players.pop()

    # assign a unique room_id
    room_id = uuid.uuid4().hex

    join_room(room_id, sid=player1)
    join_room(room_id, sid=player2)

    player1_name = clients[player1]
    player2_name = clients[player2]

    emit("room notification", f"{player1_name} JOINED", to=room_id)
    emit("room notification", f"{player2_name} JOINED", to=room_id)

    def notify_player(room_id, player1_sid, player2_name):
        # notify player 1
        emit("user notification", f"Joined room {room_id}", to=player1_sid)
        emit("user notification", f"Opponent: {player2_name}", to=player1_sid)
        emit(
            "joined room",
            {"room": room_id, "opponent": player2_name},
            to=player1_sid,
        )

    notify_player(room_id, player1, player2_name)
    notify_player(room_id, player2, player1_name)


@socketio.on("choice")
def handle_choice(data):
    try:
        room = rooms()[1]
        emit("choice", data, to=room, include_self=False)
    except IndexError:
        emit(
            "user notification",
            "ERROR: Server could not determine if you are in a room",
        )
