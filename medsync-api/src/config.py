import logging
import os

DEBUG = os.getenv("ENVIRONEMENT") == "DEV"
APPLICATION_ROOT = os.getenv("APPLICATION_APPLICATION_ROOT", "/")
HOST = os.getenv("APPLICATION_HOST")
PORT = int(os.getenv("APPLICATION_PORT", "105"))
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = os.getenv("APPLICATION_SECRET_KEY")

# SQLITE = {
#     "password": os.getenv("APPLICATION_SQLITE_PASSWORD", "password"),
#     "database": os.getenv("APPLICATION_SQLITE_DATABASE", "database.db")
# }

# POSTGRES = {
#     "user": os.getenv("POSTGRES_USER", "user"),
#     "pw": os.getenv("POSTGRES_PASSWORD", "pass"),
#     "host": os.getenv("POSTGRES_HOST", 'localhost'),
#     "port": os.getenv("POSTGRES_PORT", 5432),
#     "db": os.getenv("POSTGRES_DB", "db"),
# }

DB_URI = os.getenv("DATABASE_URL")


# logging.basicConfig(
#     filename=os.getenv("SERVICE_LOG", "server.log"),
#     level=logging.DEBUG,
#     format="%(levelname)s: %(asctime)s \
#         pid:%(process)s module:%(module)s %(message)s",
#     datefmt="%d/%m/%y %H:%M:%S",
# )
