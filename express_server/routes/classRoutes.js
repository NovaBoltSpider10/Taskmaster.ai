const express = require('express');

const {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass

} = require('../controllers/classController');

const router = express.Router();

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

module.exports = router;