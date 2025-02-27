const express = require('express');

const {
    createCalendar,
    getAllCalendar,
    getCalendarById,
    updateCalendar,
    deleteCalendar

} = require('../controllers/CalendarController');

const router = express.Router();

// GET all tasks
router.get('/', getAllCalendar);

// GET a single task by ID
router.get('/:id', getCalendarById);

// POST a new task
router.post('/', createCalendar);

// DELETE a task by ID
router.delete('/:id', deleteCalendar);

// UPDATE a task by ID
router.patch('/:id', updateCalendar);

module.exports = router;