from flask import Blueprint, render_template

rps = Blueprint("rps", __name__, template_folder="templates")

@rps.route("/")
def index():
    return render_template("index.html")