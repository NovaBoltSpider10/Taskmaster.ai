from pymongo.mongo_client import MongoClient
from datetime import datetime


class User:
    def __init__(self, sub: str):
        self.sub = sub
        self.points = 0
        self.level = 1
        self.personality: float = 0
        self.preferred_time: int = 0
        self.in_person: bool = False
        self.private_space: bool = False
        self.group_number: int = 0

        self.streak = 0
        self.last_task_date = datetime.now().date()

    def match_update(self, client: MongoClient):
        db = client['test']
        users = db['users']

        query_filter = {'sub': self.sub}
        update_operation = {"$set": {
                    "preferences": {
                    "personality": self.personality,
                    "time": self.preferred_time,
                    "inPerson": self.in_person,
                    "privateSpace": self.private_space,
                },
            }
        }

        users.update_one(query_filter, update_operation)

    def streak_update(self, client: MongoClient):
        db = client['test']
        users = db['users']

        query_filter = {'sub': self.sub}
        update_operation = {"$set": {
                "streak": self.streak,
                "lastTaskDate": self.last_task_date,
            }
        }

        users.update_one(query_filter, update_operation)

    def to_vector(self):
        return [self.personality,
                self.preferred_time,
                int(self.in_person),
                int(self.private_space) if self.in_person else -1]
