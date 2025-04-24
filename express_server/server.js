import express, { response } from "express";
import session from 'express-session'
import mongoose from "mongoose";
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import bodyParser from "body-parser";
import cors from "cors";
import axios from 'axios';

import { config, validateAuth, validateUser } from "./controllers/authController.js";
import { setupUser, getUserID } from './controllers/userController.js';

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

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

app.use(auth(config));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    },
}));
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
    if (!(await validateAuth(req, res))) {
        res.redirect('http://localhost:5173/');
        return;
    }

    if (!(await validateUser(req, res))) {
        // const id = await getUserID(req, res);
        res.redirect('http://localhost:5173/setup');
        // res.redirect('http://localhost:5000/profile');
        return;
    }

    req.session.sub = {sub: req.oidc.user.sub};
    console.log(req.session.sub);
    res.redirect('http://localhost:5173/dashboard');
});

app.get('/id', async(req, res) => {
    console.log(req.session.sub);
    res.status(200);
});

app.post('/setup', requiresAuth(), async (req, res) => setupUser(req, res));
// app.post('/setup', async(req, res) => { setupUser(req, res); } );

// app.get('/profile', async(req, res) => {
//     // res.send(req.oidc.user.sub);
//     res.send(`
//         <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
//     <form action="/setup" method="post">
//         <input type="hidden" name="username" value="hi">
//         <input type="hidden" name="firstName" value="fname">
//         <input type="hidden" name="lastName" value="lname">
//         <input type="submit" value="submit">
//     </form>
// </body>
// </html>
//         `);
//     return;
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
