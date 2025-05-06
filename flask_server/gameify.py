from pymongo.mongo_client import MongoClient
from pymongo.database import Database
from bson.objectid import ObjectId
from datetime import date, datetime, timedelta
from math import floor

from User import User


class PointSystem:
    def __init__(self, user: User, task_type, deadline):
        self.user = user
        self.task_type = task_type
        self.deadline = deadline
        self.point_dict = {"daily": 10, "weekly": 20, "monthly": 30}

    def update_streak(self):
        today = datetime.now().date()

        if self.user.last_task_date is None:
            self.user.streak = 1
        elif (today - self.user.last_task_date).days == 1:
            self.user.streak += 1
        else:
            self.user.streak = 1

        self.user.last_task_date = today

    def calculate_points(self):
        base_points = 0

        if self.task_type in self.point_dict:
            base_points = self.point_dict[self.task_type]
        else:
            print(f"Unknown task type: {self.task_type}")
            return 0

        self.completion_time = date.today()

        early = (self.deadline - self.completion_time).days
        multiplier = 1.0

        if early <= 0:
            multiplier = 1.0
        elif early == 1:
            multiplier = 1.0
        elif early > 1 and early <= 7:
            multiplier = 1.5
        elif early > 7:
            multiplier = 2.0

        self.update_streak()
        self._level_up()

        earned_points = base_points * multiplier + floor(self.user.streak * 1.4)
        self.user.points += earned_points

        return earned_points

    def get_points(self):
        return self.user.points

    def update_db(self, db: Database, earned_points, user: User):
        users = db['users']

        query_filter = {'_id': user.userId}
        update_operation = {
            "$inc": {
                "points": earned_points,
                "streak": user.streak,
            },
            "$set": {
                "lastTaskDate": datetime.combine(user.last_task_date, datetime.min.time())  # store as full datetime
            }
        }

        users.update_one(query_filter, update_operation)

    def _level_up(self):
        # level 1 --> level 2: 100 points
        # as each level increases, points needed to upgrade is (0.5 * points) + points needed

        while True:
            points_to_level_up = 100 + (50 * (self.user.level - 1))
            if self.user.points >= points_to_level_up:
                self.user.level += 1
            else:
                break


def test():
    user = User(userObject={
        "_id": ObjectId(),
        "userName": "Test User",
        "points": 0,
        "streak": 0,
        "lastTaskDate": datetime.now() - timedelta(days=1),
        "preferences": {
            "personality": 2,
            "time": 1,
            "inPerson": True,
            "privateSpace": True
        }
    })

    user.level = 1
    user.points = 0
    user.last_task_date = datetime.now().date() - timedelta(days=1)  # for streak

    tasks = [
        ("monthly", date.today() + timedelta(days=10)),
        ("monthly", date.today() + timedelta(days=10)),
        ("monthly", date.today() + timedelta(days=10)),
        ("monthly", date.today() + timedelta(days=10)),
        ("daily", date.today() + timedelta(days=1)),
        ("daily", date.today() + timedelta(days=1)),
        ("daily", date.today() + timedelta(days=1))
    ]

    for i, (task_type, deadline) in enumerate(tasks):
        print(f"\n--- Task {i+1} ---")
        ps = PointSystem(user, task_type, deadline)
        earned = ps.calculate_points()
        print(f"Earned: {earned}")
        print(f"Streak: {user.streak}")
        print(f"Points: {user.points}")
        print(f"Level: {user.level}")


def get_task_data(db: Database):
    for user in db['users'].find():
        for class_collection in db['classes'].find({"user": str(user.get("_id"))}):
            for task in db['tasks'].find({"class": class_collection.get("_id")}):
                yield (user, task)


def handle_task_completion(user_id: str, task_id: str, db: Database):
    user = db['users'].find_one({"_id": ObjectId(user_id)})
    task = db['tasks'].find_one({"_id": ObjectId(task_id)})

    task_type = task.get("taskType")
    deadline = task.get("deadline")
    deadline = deadline.date()

    user = User(userObject=user)
    ps = PointSystem(user, task_type, deadline)
    earned = ps.calculate_points()

    db['tasks'].update_one(
        {"_id": task_id},
        {"$set": {"completed": True}}
    )
    ps.update_db(db, earned, user)
    user.streak_update(db)

    return earned


def set_points(db: Database):
    try:
        for user, task in get_task_data(db):
            if not task.get("completed"):
                user_obj = User(userObject=user)
                ps = PointSystem(user_obj, task.get("taskType"), task.get("deadline").date())
                calculated_points = ps.calculate_points()
                print(calculated_points)

                db['tasks'].update_one(
                    {"_id": task.get('_id')},
                    {"$set": {"points": calculated_points }}
                )

        return 200
    except Exception as e:
        print("Error setting points: ", e)
        return 500
