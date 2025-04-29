from User import User
from user_matching import *
from mongo import *

from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from bson.objectid import ObjectId

app = Flask(__name__)
api = Api(app)


class MatchRequest(Resource):
    def get(self):
        #Return group number
        return '', 200
    
    def post(self):
        users = [User(userObject=u) for u in client['test']['users'].find()]
        # for u in users:
        #     print(f"user {u._id} answers:")
        #     print(f"Personality: {u.preferences.get('personality')}")
        #     print(f"Preferred study time: {u.preferences.get('personality')}")
        #     print(f"In person or virtual: {u.preferences.get('personality')}")
        #     if u.in_person:
        #         print(f"Public or private study area: {u.preferences.get('personality')}")

        match_client = UserMatchClient(users=users)

        groups_formed = 0
        max_groups = 3

        while groups_formed < max_groups and len(match_client.unmatched_users) >= 2:
            matched = False
            for user in match_client.unmatched_users[:]:  
                if match_client.match(user):
                    groups_formed += 1
                    matched = True
                    break  
            if not matched:
                print("No more possible matches.")
                break


class SetPreferences(Resource):
    def post(self):
        data = request.get_json()
        userId = data.get('userId')

        users = client['test']['users']
        user_object = users.update_one(
            {"_id": ObjectId(userId)}, 
            {"$set": {
            "preferences": {
                "personality": data.get('personality'),
                "time": data.get('preferred_time'),
                "inPerson": data.get('in_person'),
                "privateSpace": data.get('private_space'),
            }}}
        )
        print(user_object)    
        return 200


class finishTask(Resource):
    def post(self):
        pass


api.add_resource(MatchRequest, "/match")
api.add_resource(SetPreferences, "/set")

if __name__ == "__main__":
    app.run(host="localhost", port=6000, debug=True)
