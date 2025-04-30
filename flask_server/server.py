from User import User
from user_matching import *
from mongo import *

from flask import Flask, jsonify, request, make_response
from flask_restful import Resource, Api
from bson.objectid import ObjectId

app = Flask(__name__)
api = Api(app)


class MatchRequest(Resource):
    def post(self):
        users = client['test']['users']
        userId = request.get_json().get('userId')

        if group_number := users.find_one({"_id": ObjectId(userId)}).get('groupNumber'):
            return make_response(jsonify({"group_number": group_number}), 200)

        match_client = UserMatchClient(users=[User(userObject=u) for u in users.find()])

        while len(match_client.unmatched_users) >= 2:
            matched = False
            for user in match_client.unmatched_users[:]:  
                if match_client.match(user):
                    matched = True
                    break  
            if not matched:
                print("No more possible matches.")
                break

        for u in match_client.users:
            if u.userId != ObjectId(userId):
                continue
            
            # users.update_one(
            #     {"_id": ObjectId(u.userId)},
            #     {"$set": {
            #         "groupNumber": u.group_number,
            #     }},
            # )

            return make_response(jsonify({"group_number": u.group_number}), 200)

        return make_response(jsonify({"message": "Error grouping user"}), 404)


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
                }
            }}
        )
        return 200


class FinishTask(Resource):
    def post(self):
        pass


api.add_resource(MatchRequest, "/match")
api.add_resource(SetPreferences, "/set")

if __name__ == "__main__":
    app.run(host="localhost", port=6000, debug=True)
