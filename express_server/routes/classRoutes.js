import { Router } from 'express';

import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from '../controllers/classController.js';

const router = Router();

// GET all classs
router.get('/', getAllClasses);

// GET a single class by ID
router.get('/:id', getClassById);

// POST a new class
router.post('/', createClass);

// DELETE a class by ID
router.delete('/:id', deleteClass);

// UPDATE a class by ID
router.patch('/:id', updateClass);

export default router;