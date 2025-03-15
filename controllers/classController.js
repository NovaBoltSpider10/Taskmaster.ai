import Class from '../models/classModel.js';
import { parseAndSaveSyllabus } from '../syllabus_parser/classParser.js';


//Get all classes
const getAllClasses = async(req, res) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);

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

//POST from syllabus
const parseSyllabus = async (req, res) => {
    console.log("Called controller");
    try {
        const { syllabusFilePath } = req.body;
        if (!syllabusFilePath) {
            return res.status(400).json({ message: "Syllabus file path is required." });
        }
        await parseAndSaveSyllabus(syllabusFilePath);
        res.status(200).json({ message: "Syllabus parsed and class saved successfully." });
    } catch (error) {
        console.error("Error parsing syllabus:", error);
        res.status(500).json({ message: "An error occurred while parsing the syllabus.", error: error.message });
    }
};

export {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    parseSyllabus
};
