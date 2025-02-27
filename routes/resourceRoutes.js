const express = require('express');

const {
    createResource,
    getAllResource,
    getResourceById,
    updateResource,
    deleteResource,
    getResourcesByClassId,
    createResourceByClassId

} = require('../controllers/ResourceController');

const router = express.Router();

// GET all resources
router.get('/', getAllResource);

// GET a single resource by ID
router.get('/:id', getResourceById);

// POST a new resource
router.post('/', createResource);

// DELETE a resource by ID
router.delete('/:id', deleteResource);

// UPDATE a resource by ID
router.patch('/:id', updateResource);

// Get all resources for a certain class
router.get('/:id', getResourcesByClassId);

// Create resource by class ID
router.post('/:id', createResourceByClassId);




module.exports = router;