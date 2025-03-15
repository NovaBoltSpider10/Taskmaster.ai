import express from 'express';

import {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskByClassId,
    createTaskByClassId,
    parseSyllabus
} from '../controllers/taskController.js';

const router = express.Router();

// GET all tasks
router.get('/', getAllTask);

// GET a single task by ID
router.get('/:id', getTaskById);

// POST a new task
router.post('/', createTask);

// DELETE a task by ID
router.delete('/:id', deleteTask);

// UPDATE a task by ID
router.patch('/:id', updateTask);

//Get all tasks by class
router.get('/:id', getTaskByClassId);

//Get all tasks by syllabus path
router.post('/syllabus', parseSyllabus)

//Create task by class id
router.post('/:id', createTaskByClassId);


export default router;