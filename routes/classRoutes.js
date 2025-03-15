import express from 'express';

import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    parseSyllabus
} from '../controllers/classController.js'; 

const router = express.Router();

// GET all classs
router.get('/', getAllClasses);

// GET a single class by ID
router.get('/:id', getClassById);

//Get all deatils by syllabus path
router.post('/syllabus', parseSyllabus)

// DELETE a class by ID
router.delete('/:id', deleteClass);

// UPDATE a class by ID
router.patch('/:id', updateClass);

// POST a new class
router.post('/', createClass);

export default router;
