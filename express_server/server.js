import express from "express";
import mongoose from "mongoose";
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import bodyParser from "body-parser";
import cors from "cors";

import {config, validateAuth} from "./controllers/authController.js";
import { setupUser } from './controllers/userController.js';

// Routes files
import taskRoutes from './routes/taskRoutes.js';
import resourcesRoutes from './routes/resourceRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import classRoutes from './routes/classRoutes.js';
import userRoutes from './routes/userRoutes.js'
import flashCardRoutes from './routes/flashCardsRoutes.js'

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(auth(config));
app.use(auth(config));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());
app.use('/user', userRoutes);
app.use('/tasks', taskRoutes); //Works: POST tested only
app.use('/resources', resourcesRoutes); //Works: POST tested only
app.use('/class', classRoutes); //Works: POST tested only
app.use('/calendar', calendarRoutes); //Works: POST tested only
app.use('/cards', flashCardRoutes);

// Controller/routes code for auth
app.get('/', async (req, res) => {
    if (!validateAuth(req, res)) {
        res.status(200).json({message: 'Logged out'});
    if (!validateAuth(req, res)) {
        res.status(200).json({message: 'Logged out'});
        return;
    }
});

// app.post('/setup', requiresAuth(), async() => { setupUser(req, res); } );
app.post('/setup', async() => { setupUser(req, res); } );

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
