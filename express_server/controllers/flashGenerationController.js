import FlashCards from '../models/flashCardsModel.js';
import flashCardGeneration from '../flashCard_AI/flashCardGenerator.js'

//Get all FlashCards
const getAllFlashCards = async(req, res) => {
    try {
        const flashCards = await FlashCards.find();
        res.status(200).json(flashCards);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get FlashCards by ID
const getFlashCardsById = async(req, res) => {
    try {
        const flashCards = await FlashCards.findById(req.params.id);
        if (!flashCards)
        {
            return res.status(404).json({ message: "Flash Card not found" });
        }

        res.status(200).json(flashCards);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update class
const updateFlashCards = async(req, res) => {
    try {
        const {topic, question, answer} = req.body;
        const updatedFlashCard = await FlashCards.findByIdAndUpdate(req.params.id, {topic, question, answer}, {new: true});

        if (!updatedFlashCard)
        {
            return res.status(404).json({ message: "Flash Card not found" });
        }

        res.status(200).json(updatedClass);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Delete class
const deleteFlashCards = async(req, res) => {
    try {
        const deletedClass = await FlashCards.findByIdAndDelete(req.params.id);
        if (!deletedClass)
        {
            return res.status(404).json({message: "Class not found"});
        }
        res.status(200).json({message: "Class deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//POST flash cards
const generateFlashCards = async(req, res) => {
    try {
        const id = req.params.id;
        await flashCardGeneration(id);
        res.status(200).json({message: "Flash cards successfully created"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



export {
    getAllFlashCards,
    getFlashCardsById,
    updateFlashCards,
    deleteFlashCards,
    generateFlashCards
};
