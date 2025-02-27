const express = require('express');

const {
    createTask,
    getAllTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskByClassId,
    createTaskByClassId

} = require('../controllers/TaskController');

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

//Create task by class id
router.post('/:id', createTaskByClassId);


module.exports = router;