from flask import (
    Blueprint,
    flash,
    render_template,
    request,
    session,
    redirect,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

from app.db import client
from bson.json_util import dumps  # needed to serialize mongo object to json

auth = Blueprint("auth", __name__, url_prefix="/auth")

db = client["rps"]
Users = db.users


@auth.route("/register/", methods=("GET", "POST"))
def register():

    # redirect logged in users
    if "username" in session:
        return redirect(url_for("index"))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        error = None

        if not username:
            error = "Username is required."
        elif not password:
            error = "Password is required."
        elif Users.find_one({"username": username}) is not None:
            error = f"User {username} is already registered."

        if error is None:
            # TODO add error handling for failed insert
            user = {
                "username": username,
                "password": generate_password_hash(password),
                "gameScore": {"draws": 0, "wins": 0, "losses": 0},
            }
            Users.insert_one(user).inserted_id
            flash("Register successful, please login.")
            return redirect(url_for("auth.login"))

        flash(error)

    return render_template("register.html")


@auth.route("/login/", methods=("GET", "POST"))
def login():

    # redirect logged in users
    if "username" in session:
        return redirect(url_for("rps.play"))

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        error = None

        user = Users.find_one({"username": username})

        if user is None:
            error = "Incorrect username."
        elif check_password_hash(user["password"], password) is False:
            error = "Incorrect password."

        if error is None:
            session.clear()
            session["username"] = user["username"]
            session["id"] = str(user["_id"])
            return redirect(url_for("rps.index"))

        flash(error)

    return render_template("login.html")


@auth.route("/health/")
def auth_health():
    return f"DB query returned: {Users.count_documents({})} user(s)."


@auth.route("/test-post/")
def auth_test_post():
    user_id = Users.insert_one({"username": "testUser123"}).inserted_id
    return f"User id {user_id}, total users: {Users.count_documents({})}"


@auth.route("/test-get/")
def auth_test_get():

    user = Users.find_one({"username": "testUser123"})

    if user is None:
        return "Not found"

    return dumps(user)


@auth.route("/test-put/")
def auth_test_put():
    result = Users.update_one(
        {"username": "testUser123"}, {"$set": {"updatedInfo": "update"}}
    )
    return f"Modified {result.modified_count} user"


@auth.route("/test-delete/")
def auth_test_delete():
    result = Users.delete_one({"username": "testUser123"})
    return f"Deleted {result.deleted_count} user"


@auth.route("/logout/")
def logout():
    session.clear()
    return redirect(url_for("rps.index"))
