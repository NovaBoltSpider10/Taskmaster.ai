import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Routes files
import taskRoutes from './routes/taskRoutes.js';
import resourcesRoutes from './routes/resourceRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import classRoutes from './routes/classRoutes.js';

dotenv.config();


const port = 3000;
const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes); //Works: POST tested only
app.use('/resources', resourcesRoutes); //Works: POST tested only
app.use('/class', classRoutes); //Works: POST tested only
app.use('/calendar', calendarRoutes); //Works: POST tested only

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

// app.use(jwtCheck);

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});

