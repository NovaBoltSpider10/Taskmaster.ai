from datetime import date, datetime, timedelta
from pymongo.mongo_client import MongoClient
from User import User

class PointSystem:
    def __init__(self, user_points, task_type, deadline):
        self.user_points = user_points
        self.task_type = task_type
        self.deadline = deadline
        self.point_dict = {"daily": 10, "weekly": 20, "monthly": 30}

    def update_streak(user: User):
        today = datetime.now().date()

        if (today - user.last_task_date).days == 1:
            user.streak += 1
        else:
            user.streak = 1

        user.last_task_date = today

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
        
        earned_points = base_points * multiplier + round(self.streak * 1.4)
        self.user_points += earned_points

        return earned_points
    
    def get_points(self):
        return self.user_points
    
    def update_db(self, client: MongoClient, earned_points, user: User, task_id):
        db = client['test']
        users = db['tasks']

        query_filter = {'sub': user.sub} # task id?
        update_operation = {"$inc": { 
                "points": earned_points,
                "streak": user.streak,
                "lastTaskDate": user.last_task_date
            }
        }

        # "completed": True, -> task db by task id
        # "earnedPoints": earned_points, -> task db by task id

        users.update_one(query_filter, update_operation)


def test():
    user_points = 0 # get from db

    task_type = "monthly" # Get from the prompt
    deadline = date.today() + timedelta(days = 1) # get from the prompt

    point_system = PointSystem(user_points, task_type, deadline)
    earned_points = point_system.calculate_points() # updated in db

    print(f"User earned {earned_points} points for completing a {point_system.task_type}")
    point_system.update_db(MongoClient, earned_points, "")


if __name__ == "__main__":
    test()
