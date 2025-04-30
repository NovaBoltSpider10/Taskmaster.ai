from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

uri = os.environ['DB_URL']

client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
except Exception as e:
    print(e)