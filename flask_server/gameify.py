from datetime import date, datetime, timedelta

class PointSystem:
    def __init__(self, user_points):

        self.user_points = user_points
        self.point_dict = {"daily": 10, "weekly": 20, "monthly": 30}

    def update_streak(user):
        today = datetime.now().date()

        if (today - user.last_task_date).days == 1:
            user.streak += 1
        else:
            user.streak = 1

        user.last_task_date = today

    def calculate_points(self, task_type, deadline, completion_time):
        base_points = 0
        
        if task_type in self.point_dict:
            base_points = self.point_dict[task_type]
        else:
            print(f"Unknown task type: {task_type}")
            return 0

        early = (deadline - completion_time).days
        multiplier = 1.0

        if early <= 0:
            multiplier = 1.0
        elif early == 1:
            multiplier = 1.0
        elif early > 1 and early <= 7:
            multiplier = 1.5
        elif early > 7:
            multiplier = 2.0

        earned_points = base_points * multiplier

        self.user_points += earned_points

        return earned_points

    def get_points(self):
        return self.user_points

def test():
    user_points = 0

    point_system = PointSystem(user_points)

    task_type = "monthly"
    deadline = date.today() + timedelta(days = 3)
    completion_time = date.today()
    
    earned_points = point_system.calculate_points(task_type, deadline, completion_time)

    print(f"User earned {earned_points} points for completing a {task_type}")


if __name__ == "__main__":
    test()
