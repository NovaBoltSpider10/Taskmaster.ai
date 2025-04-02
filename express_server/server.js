import express from "express";
import mongoose from "mongoose";
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import bodyParser from "body-parser";

import authController from "./controllers/authController.js";
import {setupUser} from './controllers/userController.js';     
import User from "./models/userModel.js";


// Routes files
import taskRoutes from './routes/taskRoutes.js';
import resourcesRoutes from './routes/resourceRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import classRoutes from './routes/classRoutes.js';

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(auth(authController.config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(express.json());
app.use('/tasks', taskRoutes); //Works: POST tested only
app.use('/resources', resourcesRoutes); //Works: POST tested only
app.use('/class', classRoutes); //Works: POST tested only
app.use('/calendar', calendarRoutes); //Works: POST tested only

// Controller/routes code for auth
app.get('/', async (req, res) => {
    if (!authController.validateAuth(req, res)) {
        return;
    }
});

app.post('/setup', requiresAuth(), async (req, res) => {
    if (!setupUser(req, res)) {
        return;
    }
});

app.get('/profile', requiresAuth(), async (req, res) => {
    const existingUser = await User.findOne({ sub: req.oidc.user.sub });
    res.send(existingUser);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
