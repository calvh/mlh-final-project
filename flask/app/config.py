import os


class Config:
    DEBUG = True if os.environ.get("DEBUG") == "True" else False
    DEVELOPMENT = True if os.environ.get("DEVELOPMENT") == "True" else False
    SECRET_KEY = os.environ.get("SECRET_KEY")
