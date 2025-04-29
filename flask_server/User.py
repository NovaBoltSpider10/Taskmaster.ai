from pymongo.mongo_client import MongoClient
from datetime import datetime
from bson.objectid import ObjectId


class User:
    def __init__(self, userId: str="", client: MongoClient=None, userObject: dict=None):
        if userId:
            userObject = client['test']['users'].find_one({"_id": ObjectId(userId)})

        self.userId = userObject.get("_id")
        self.preferences = userObject.get("preferences")
        # self.personality = userObject.get("preferences").get("personality")
        # self.preferred_time = userObject.get("preferences").get("preferred_time")
        # self.in_person = userObject.get("preferences").get("personality")
        # self.private_space = userObject.get("preferences").get("personality")
        self.points = userObject.get("points")
        self.streak = userObject.get("streak")
        self.last_task_date = userObject.get("lastTaskDate")
        self.group_number = userObject.get("groupNumber")
        self.level = userObject.get("level")


    def match_update(self, client: MongoClient):
        db = client['test']
        users = db['users']

        query_filter = {'_id': self.userId}
        update_operation = {"$set": {
                    "preferences": self.preferences,
                    # {
                    #     "personality": self.personality,
                    #     "time": self.preferred_time,
                    #     "inPerson": self.in_person,
                    #     "privateSpace": self.private_space,
                    # },
            }
        }

        users.update_one(query_filter, update_operation)

    def streak_update(self, client: MongoClient):
        db = client['test']
        users = db['users']

        query_filter = {'_id': self.userId}
        update_operation = {"$set": {
                "streak": self.streak,
                "lastTaskDate": self.last_task_date,
            }
        }

        users.update_one(query_filter, update_operation)

    def to_vector(self):
        return [
            self.preferences.get('personality'),
            self.preferences.get('preferred_time'),
            int(self.preferences.get('in_person')),
            int(self.preferences.get('private_space')) if self.preferences.get('in_person') else -1,
        ]
    
        # return [self.personality,
        #         self.preferred_time,
        #         int(self.in_person),
        #         int(self.private_space) if self.in_person else -1]
