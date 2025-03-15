import express from 'express';
import {
    createCalendar,
    getAllCalendar,
    getCalendarById,
    updateCalendar,
    deleteCalendar
} from '../controllers/calendarController.js';

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

export default router;