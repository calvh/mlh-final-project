import datetime

from flask import Flask, Response
from flask import render_template

from app.config import Config
from app.rps import rps
from app.auth import auth
from app.socketio_init import socketio
from app.socketio_bp import socketio_bp


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    with app.app_context():
        app.register_blueprint(auth)
        app.register_blueprint(rps)
        app.register_blueprint(socketio_bp)

        @app.context_processor
        def inject_current_year():
            return {"current_year": datetime.datetime.now().year}

        @app.route("/health")
        def health():
            return Response(status=200)

        @app.errorhandler(404)
        def not_found(error_message):
            return render_template("404.html"), 404

        socketio.init_app(app)
        return app
