from flask import Blueprint, render_template, request, session

from app.db import client

rps = Blueprint("rps", __name__, template_folder="templates")

db = client["rps"]
Users = db.users


@rps.route("/")
def index():
    return render_template("index.html")


@rps.route("/play")
def play():
    return render_template("play.html")


@rps.route("/stats")
def stats():
    return render_template("stats.html")


@rps.route("/scores", methods=["PUT"])
def update_scores():
    if request.method == "PUT":

        username = session.get("username")

        # handle erroneous requests from anonymous users
        if username is None:
            return "BAD_REQUEST", 400

        result = request.get_json().get("result")

        # handle invalid result or no result
        if result is None or result not in {"w", "l", "d"}:
            return "BAD_REQUEST", 400

        result_map = {
            "w": "gameScore.wins",
            "l": "gameScore.losses",
            "d": "gameScore.draws",
        }

    db_result = Users.update_one(
        {"username": username}, {"$inc": {result_map[result]: 1}}
    )

    if db_result.acknowledged:
        return "OK", 200

    return "DB_ERROR", 500
