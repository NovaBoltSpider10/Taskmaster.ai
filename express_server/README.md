# API Documentation for TaskMaster.AI

This document provides an overview of the API endpoints available on TaskMaster.ai Express server. For Frontend-dev team

## Base URL

The base URL for all API endpoints is:

http://localhost:3000/

## Error Handling

The API uses standard HTTP status codes to indicate the outcome of requests. Common error codes include:

- 200 OK: The request was successful.
- 201 Created: A new resource was successfully created.
- 204 No Content: The request was successful, but there is no content to return.
- 400 Bad Request: The request was malformed or invalid. The response body may contain details about the error.
- 401 Unauthorized: Authentication is required, or the provided credentials are invalid.
- 403 Forbidden: The server understands the request but refuses to authorize it.
- 404 Not Found: The requested resource could not be found.
- 500 Internal Server Error: An unexpected error occurred on the server.

# Class Routes

### Create a new Class Post

- Endpoint: /class/
- Method: POST
- Description: Creates a class doc in mongodb.
- Authentication: Requires userId in json body
- Request Body (application/json):

```json
{
  "professor": "Dr. Jane Smith",
  "timing": "MWF 10:00 AM - 11:15 AM",
  "examDates": ["2025-05-01T00:00:00Z", "2025-06-15T00:00:00Z"],
  "topics": ["Data Structures", "Algorithms", "Recursion", "Big O Notation"],
  "gradingPolicy": "30% Exams, 30% Projects, 20% Quizzes, 20% Attendance",
  "contactInfo": "jsmith@university.edu",
  "textbooks": [
    "Introduction to Algorithms by Cormen",
    "Data Structures and Algorithms in Java by Goodrich"
  ],
  "location": "Room ECSW 2.410",
  "user": "google-oauth2|117092462712380430315"
}
```

### Get all Classes from database (Don't use in client side user)

- Endpoint: /class/
- Method: GET
- Description: Get all classes doc in mongodb.
- Request Body (None):

### Get all classes by id

- Endpoint: /class/single/:id
- Method: GET
- Description: Get single class by id parameter.
- Request Body (None):

### Get all classes by userid

- Endpoint: /class/user/:userid
- Method: GET
- Description: Get all classes associated with userid.
- Request Body (None):

### Delete class by id

- Endpoint: /class/:id
- Method: DELETE
- Description: Deletes class by id
- Request Body (None):

### Patch class by id

- Endpoint: /class/:id
- Method: PATCH
- Description: PATCH class by id and parameters
- Request Body (application/json):

```json
{
  "professor": "Dr. Tejas Raman",
  "timing": "MW 10:00 AM - 11:15 AM",
  "gradingPolicy": "Free hundreds",
  "contactInfo": "jsmith@unsity.edu",
  "textbooks": ["Introduction to Algorithms by Cormen"],
  "location": "Room ECSW 2.420"
}
```

# AI-FlashCards Routes

### Get all Flash Cards from database (Don't use in client side user)

- Endpoint: /cards/
- Method: GET
- Description: Get all cards doc in mongodb.
- Request Body (None):

### Get cards by id

- Endpoint: /cards/single/:id
- Method: GET
- Description: Get single class by id parameter.
- Request Body (None):

### Get all cards by classid

- Endpoint: /cards/class/:id
- Method: GET
- Description: Get all cards associated with classid.
- Request Body (None):

### Delete card by id

- Endpoint: /cards/:id
- Method: DELETE
- Description: Deletes card by id
- Request Body (None):

### Patch class by id

- Endpoint: /class/:id
- Method: PATCH
- Description: PATCH class by id and parameters
- Request Body (application/json):

```json
{
  "topic": "Test test second test",
  "question": "This is a test question modified by patch"
}
```

### Generate new Flashcards Post

- Endpoint: /cards/:id
- Method: POST
- Description: Creates flashcards in mongodb based on class topics using Gemini API.
- Authentication: Requires userId in api call
- Request Body (none):

# Resource Routes

### Get all Resources from database (Don't use in client side user)

- Endpoint: /cards/
- Method: GET
- Description: Get all cards doc in mongodb.
- Request Body (None):

### Get single resource by id

- Endpoint: /resources/single/:id
- Method: GET
- Description: Get single resource by resourceid parameter.
- Request Body (None):

### Get all resources by classid

- Endpoint: /cards/class/:id
- Method: GET
- Description: Get all cards associated with classid.
- Request Body (None):


# Task Routes

# User Routes

### Syllabus AI with Gemini API

- 

### Author: Tejas, Sriyuth, Srikar
