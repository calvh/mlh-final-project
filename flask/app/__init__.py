import datetime

from flask import Flask, Response
from flask import render_template
from flask_migrate import Migrate

from app.config import Config
from app.rps import rps
from app.auth import auth
from app.models import db

migrate = Migrate()


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        app.register_blueprint(auth)
        app.register_blueprint(rps)

        @app.context_processor
        def inject_current_year():
            return {"current_year": datetime.datetime.now().year}

        @app.route("/health")
        def health():
            return Response(status=200)

        @app.errorhandler(404)
        def not_found(error_message):
            return render_template("404.html"), 404

        return app
