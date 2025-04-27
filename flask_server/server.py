from User import User
from user_matching import *
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from mongo import *

app = Flask(__name__)
api = Api(app)


class MatchRequest(Resource):
    def get(self):
        #Return group number
        return '', 200
    
    def post(self):
        users = []
        for i in range(9):
            u = User(userId=str(i))
            u.personality = random.random()
            u.preferred_time = random.randint(0, 3)
            u.in_person = random.choice([True, False])
            u.private_space = random.choice([True, False]) if u.in_person else False
            users.append(u)
            print(f"user {i} answers:")
            print(f"Personality: {u.personality}")
            print(f"Preferred study time: {u.preferred_time}")
            print(f"In person or virtual: {u.in_person}")
            if u.in_person:
                print(f"Public or private study area: {u.private_space}")
        client = UserMatchClient(users=users)

        groups_formed = 0
        max_groups = 3

        while groups_formed < max_groups and len(client.unmatched_users) >= 2:
            matched = False
            for user in client.unmatched_users[:]:  
                if client.match(user):
                    groups_formed += 1
                    matched = True
                    break  
            if not matched:
                print("No more possible matches.")
                break


class finishTask(Resource):
    def post(self):
        pass


api.add_resource(MatchRequest, "/match")

if __name__ == "__main__":
    app.run(host="localhost", port=6000, debug=True)
