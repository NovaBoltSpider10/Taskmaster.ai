const Class = require('../models/classModel');

//Get all classes
const getAllClasses = async(req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get class by ID
const getClassById = async(req, res) => {
    try {
        const classes = await Class.findById(req.params.id);
        if (!classes)
        {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json(classes);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Create class
const createClass = async(req, res) => {
    try {
        const {professor, time, assignmentDueDate, examDate, topics, gradingPolicy, contactInfo, textbooks, location, resources} = req.body;

        const newClass = new Class({professor, time, assignmentDueDate, examDate, topics, gradingPolicy, contactInfo, textbooks, location, resources});
        const savedClass = await newClass.save();
        res.status(201).json(savedClass);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update class
const updateClass = async(req, res) => {
    try {
        const {professor, time, assignmentDueDate, examDate, topics, gradingPolicy, contactInfo, textbooks, location, resources} = req.body;
        const updatedClass = await Task.findByIdAndUpdate(req.params.id, {professor, time, assignmentDueDate, examDate, topics, gradingPolicy, contactInfo, textbooks, location, resources}, {new: true});

        if (!updatedClass)
        {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json(updatedClass);

    } catch (error) {

        res.status(500).json({message: error.message});
    }
};

//Delete class
const deleteClass = async(req, res) => {
    try {
        const deletedClass = await Class.findByIdAndDelete(req.params.id);
        if (!deletedClass)
        {
            return res.status(404).json({message: "Class not found"});
        }
        res.status(200).json({message: "Class deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
};
