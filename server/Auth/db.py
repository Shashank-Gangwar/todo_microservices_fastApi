from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(".env")

MONGO_URI = os.getenv('MONGO_URI')


client = MongoClient(MONGO_URI)
db = client.fastapi
users_collection = db["users"]


#veryfing the connection
try:
    client.server_info() 
    # Verify the connection by checking the server info
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(e)