from flask import Blueprint, render_template

rps = Blueprint("rps", __name__, template_folder="templates")


@rps.route("/")
def index():
    return render_template("index.html")


@rps.route("/play")
def play():
    return render_template("play.html")


@rps.route("/stats")
def stats():
    return render_template("stats.html")


@rps.route("/mainpage")
def index_logged_in():
    return render_template("index_logged_in.html")