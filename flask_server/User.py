from pymongo.mongo_client import MongoClient
from pymongo.database import Database
from datetime import datetime
from bson.objectid import ObjectId


class User:
    def __init__(self, userId: str = "", client: MongoClient = None, userObject: dict = None):
        if userId and client:
            userObject = client['test']['users'].find_one({"_id": ObjectId(userId)})

        self.userId = userObject.get("_id") or ""
        self.preferences = userObject.get("preferences") or {}
        self.name = userObject.get("userName") or ""
        self.points = userObject.get("points", 0) or 0
        self.streak = userObject.get("streak", 0) or 0
        self.last_task_date = userObject.get("lastTaskDate") or ""

        # Ensure last_task_date is always a datetime.date object
        if isinstance(self.last_task_date, datetime):
            self.last_task_date = self.last_task_date.date()

        self.group_number = userObject.get("groupNumber", 0) or 0
        self.level = userObject.get("level", 1) or 0

    def streak_update(self, db: Database):
        users = db['users']

        query_filter = {'_id': self.userId}
        update_operation = {
            "$set": {
                "streak": self.streak,
                "lastTaskDate": datetime.combine(self.last_task_date, datetime.min.time())  # ensures datetime
            }
        }

        users.update_one(query_filter, update_operation)

    def to_vector(self):
        return [
            self.preferences.get('personality'),
            self.preferences.get('time'),
            int(self.preferences.get('inPerson')),
            int(self.preferences.get('privateSpace')) if self.preferences.get('inPerson') else -1,
        ]

        # return [self.personality,
        #         self.preferred_time,
        #         int(self.in_person),
        #         int(self.private_space) if self.in_person else -1]
