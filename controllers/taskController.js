const Task = require('../models/taskModel');

//Get all tasks
const getAllTasks = async(req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get task
const getTask = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!user)
        {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({message: error.message});
    }


};

//Create task
const createTask = async(req, res) => {
    try {
        const {title, description, dueDate, status, priority} = req.body;

        const newTask = new Task({title, description, dueDate, status, priority});

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update task
const updateTask = async(req, res) => {
    try {
        const {title, description, dueDate, status, priority} = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {title, description, dueDate, status, priority}, {new: true});

        if (!updatedTask)
        {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);

    } catch (error) {

        res.status(500).json({message: error.message});
    }
};

//Delete task
const deleteTask = async(req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask)
        {
            return res.status(404).json({message: "Task mot found"});
        }
        res.status(200).json({message: "Task deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};
