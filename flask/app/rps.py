from flask import Blueprint, render_template, request, session, jsonify
import json
import pymongo
from pymongo import ObjectId

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
def inc_scores():
    if request.method == "PUT":
        result = request.get_json()["result"]
        username = session["username"]
        # insert/update in DB
        if result == "w":
            Users.update_one(
                {"username": username}, 
                {"$inc": 
                    {
                    "gameScore.wins": 1
                    }
                }
            )
        elif result == "l":
            Users.update_one(
                {"username": username}, 
                {"$inc": 
                    {
                    "gameScore.losses": 1
                    }
                }
            )
        elif result == "d":
            Users.update_one(
                {"username": username}, 
                {"$inc": { "gameScore.draws": 1}}
            )
    return json.dumps({"status": "OK", 
                        "user is ": username, 
                        "\ngame-score": result
                    })
