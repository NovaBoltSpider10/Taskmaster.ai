from flask import Flask
import numpy as np

app = Flask(__name__)
app.debug = True

@app.route("/")
def get_data():
    return "Hello! <br> Test!"

a = np.array([1, 2, 3])
b = np.array([2, 3, 4])
c = a + b
print (c)




userProfiles = [{"user1": "bob", "classes": ["Computer Science 2," "Linear Algebra," "Differential Calculus"]},
                {"user2": "mark", "classes": ["Computer Science 2", "World History", "English"]},
                {"user3": "gabe", "classes": ["Linear Algebra", "Differential Calculus", "Machine Learning"]}]


if __name__ == '__main__':
    app.run(host="localhost", port="5000")