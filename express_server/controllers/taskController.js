import Task from '../models/taskModel.js';
import { parseAndSaveSyllabus } from '../syllabus_parser/taskParser.js';

//Get all tasks
const getAllTask = async(req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get task
const getTaskById = async(req, res) => {
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

//Get task by class ID
const getTaskByClassId = async(req, res) => {
    try {
        const tasks = await Task.findById({classId: req.params.classId});
        
        if (!tasks)
        {
            return res.status(404).json({ message: "No tasks found for this class" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

 //Create task by ID
const createTaskByClassId = async(req, res) => {
    try {
        const {title, description, dueDate, status, priority} = req.body;
        const {classId} = req.params;

        if(!classId)
        {
            return res.status(404).json({message: "Class ID is required"});
        }

        const newTask = new Task({title, description, dueDate, status, priority, classId});

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Create task by Syllabus
const parseSyllabus = async (req, res, next) => {
    console.log("Called TASK TASK controller");
    try {
        const { syllabusFilePath } = req.body;
        if (!syllabusFilePath) {
            return res.status(400).json({ message: "Syllabus file path is required." });
        }
        await parseAndSaveSyllabus(syllabusFilePath);
        console.log("Syllabus parsed and tasks saved successfully.");
        next();
    } catch (error) {
        console.error("Error parsing syllabus:", error);
        next(error);
    }
};


export {
    getAllTask,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskByClassId,
    createTaskByClassId,
    parseSyllabus
};
