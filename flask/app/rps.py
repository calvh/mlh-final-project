from flask import Blueprint, render_template, request, session
import json

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
def scores():
    print("ABCDEVH")
    print(request.get_data())
    print(request.data)
    print("getting JSON: ", request.get_json())

    score_data = request.get_json()
    print("scoredata: ", score_data)

    if request.method == "PUT":
        username = session["username"]
        # insert/update in DB
        Users.update_one(
            {"username": username},
            {"$set": {"gameScore": score_data}},
            upsert=True
        )
    return json.dumps(
        {"\nstatus": "OK", "user is": username, "\ngame-score": score_data}
    )
