import os

class Config:
    DEBUG = True if os.environ.get("DEBUG") == "True" else False
    DEVELOPMENT = True if os.environ.get("DEVELOPMENT") == "True" else False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = True if os.environ.get("SQLALCHEMY_TRACK_MODIFICATIONS") == "True" else False
    SQLALCHEMY_DATABASE_URI = (
        "postgresql://{user}:{password}@{hostname}:{port}/{db}".format(
            user=os.environ.get("POSTGRES_USER"),
            password=os.environ.get("POSTGRES_PASSWORD"),
            hostname=os.environ.get("HOSTNAME"),
            port=os.environ.get("PORT"),
            db=os.environ.get("POSTGRES_DB"),
        )
    )
