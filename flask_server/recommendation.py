from datetime import date, datetime, timedelta
from pymongo.mongo_client import MongoClient
from User import User
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

resources = [
    {"title": "Khan Academy - Forces", "url": "https://...", "desc": "Forces and Newton's Laws"},
    {"title": "Crash Course Physics Ep 5", "url": "https://...", "desc": "Newton's Three Laws"},
]
def get_desc():
    


def _recommend_resources():
    tests = 
    embeddings = model.encode(resources)
    print(embeddings.shape)
    similarities = model.similarity(embeddings, embeddings)
    print(similarities)