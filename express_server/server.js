import express, { response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
// Routes files
import taskRoutes from './routes/taskRoutes.js';
import resourcesRoutes from './routes/resourceRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import classRoutes from './routes/classRoutes.js';
import userRoutes from './routes/userRoutes.js';
import flashCardRoutes from './routes/flashCardsRoutes.js';
import authRoutes from './routes/authRoutes.js';

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Explicitly configure CORS to allow only the frontend origin
// Ensure this is the very first middleware
app.use(cors({ origin: 'http://localhost:5173' }));
mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error: ", err));

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
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
