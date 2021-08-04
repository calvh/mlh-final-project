from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash

from app.models import db, User

auth = Blueprint("auth", __name__, url_prefix="/auth")


@auth.route("/register/", methods=("GET", "POST"))
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        error = None

        if not username:
            error = "Username is required."
        elif not password:
            error = "Password is required."
        elif User.query.filter(User.username == username).first() is not None:
            error = f"User {username} is already registered."

        if error is None:
            db.session.add(
                User(username=username, password=generate_password_hash(password))
            )
            db.session.commit()
            flash("Register successful, please login.")
            return redirect(url_for("auth.login"))

        flash(error)

    return render_template("register.html")


@auth.route("/login/", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        error = None

        user = User.query.filter(User.username == username).first()

        if user is None:
            error = "Incorrect username."
        elif check_password_hash(user.password, password) is False:
            error = "Incorrect password."

        if error is None:
            session.clear()
            session["username"] = user.username
            session["id"] = user.id
            return redirect(url_for("rps.index"))

        flash(error)

    elif "username" in session:
        return redirect(url_for("rps.index"))

    return render_template("login.html")


@auth.route("/health/")
def auth_health():
    users = User.query.all()
    return f"DB query returned: {len(users)} user(s)."


@auth.route("/logout/")
def logout():
    session.clear()
    return redirect(url_for("rps.index"))
