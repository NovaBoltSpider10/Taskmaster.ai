from flask import Flask, jsonify, request
from flask_restful import Resource, Api

from flask_server.User import User
from user_matching import *
from flask import Flask, jsonify, request
from flask_restful import Resource, Api

from flask_server.User import User
from user_matching import *

app = Flask(__name__)
api = Api(app)


class MatchRequest(Resource):
    def get(self):
        #Return group number
        return '', 200
    
    def post(self):
        print(request.get_json())
        
        users: list[User] = []
        for i in range(102):
            users.append(User())
            users[i].personality = random.random()
            users[i].preferred_time = random.randint(0, 3)
            users[i].in_person = random.randint(0, 1)

            if users[i].in_person:
                users[i].private_space = random.randint(0, 1)

        matchClient = UserMatchClient(users=users)
        matchClient.match(users[0])
        
        return jsonify(users), 200
        # get user form post data
        # get user from database
        # return matched group


'''
When user wants to get points:
Make call: send which task got completed with mongo id
Initialize point system with db data
Calculate points
Update db
return response ok
'''


api.add_resource(MatchRequest, "/match")

if __name__ == "__main__":
    app.run(host="localhost", port=6000, debug=True)
