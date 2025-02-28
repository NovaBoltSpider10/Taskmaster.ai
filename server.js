const express = require("express");
const mongoose = require("mongoose");
// const jwtCheck = require('./controllers/jwtCheck.js');
require("dotenv").config();

//Routes files
const taskRoutes = require('./routes/taskRoutes');
const resourcesRoutes = require('./routes/resourceRoutes');
const calendarRoutes = require('./routes/calendarRoutes')
const classRoutes = require('./routes/classRoutes')


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