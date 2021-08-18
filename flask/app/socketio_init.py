from flask_socketio import SocketIO


socketio = SocketIO(
    logger=True,
    engineio_logger=True,
    always_connect=True,
    ping_interval=12,
    ping_timeout=4,
    cors_allowed_origins=[
        "https://localhost",
        "http://localhost",
        "http://localhost:5000",
        "http://127.0.0.1",
        "http://127.0.0.1:5000",
        "https://rockpaperscissors.duckdns.org",
    ],
)
