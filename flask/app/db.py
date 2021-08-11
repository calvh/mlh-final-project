import os
from pymongo import MongoClient

MONGODB_URI = (
    "mongodb://"
    "{user}:{password}@{hostname}:{port}/{db}?authSource={authSource}".format(
        user=os.environ.get("MONGO_INITDB_ROOT_USERNAME"),
        password=os.environ.get("MONGO_INITDB_ROOT_PASSWORD"),
        hostname=os.environ.get("HOSTNAME"),
        port=27017,
        db=os.environ.get("MONGO_DB"),
        authSource=os.environ.get("AUTH_SOURCE"),
    )
)

client = MongoClient(MONGODB_URI)
