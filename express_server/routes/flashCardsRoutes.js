import { Router } from 'express';

import { 
    getAllFlashCards,
    getFlashCardsById,
    updateFlashCards,
    deleteFlashCards,
    generateFlashCards
} from '../controllers/flashGenerationController.js';

const router = Router();

// GET all classs
router.get('/', getAllFlashCards);

// GET a single class by ID
router.get('/:id', getFlashCardsById);

// DELETE a flashcard by ID
router.delete('/:id', deleteFlashCards,);

// UPDATE a flashcard by ID
router.patch('/:id', updateFlashCards);

// Generate Flash Cards bn classid
router.post("/:id", generateFlashCards);

export default router;