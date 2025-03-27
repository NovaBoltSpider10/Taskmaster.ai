import { Router } from 'express';
import { createResource, getAllResources, getResourceById, updateResource, deleteResource, getResourcesByClassId, createResourceByClassId, parseSyllabus } from '../controllers/resourceController';

const router = Router();

// GET all resources
router.get('/', getAllResources);

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

router.post('/syllabus', parseSyllabus)

// Create resource by class ID
router.post('/:id', createResourceByClassId);




export default router;