import Resource, { find, findById } from '../models/resourceModel';
import { parseAndSaveSyllabus } from '../syllabus_parser/resourceParser.js';

//Get all resources
const getAllResources = async(req, res) => {
    try {
        const resources = await find();
        res.status(200).json(resources);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get resource by Id
const getResourceById = async(req, res) => {
    try {
        const resource = await findById(req.params.id);
        if (!resource)
        {
            return res.status(404).json({ message: "Resource not found" });
        }

        res.status(200).json(resource);

    } catch (error) {
        res.status(500).json({message: error.message});
    }


};

//Create resource
const createResource = async(req, res) => {
    try {
        const {url, website} = req.body;

        const newResource = new Resource({url, website});

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update resource
const updateResource = async(req, res) => {
    try {
        const {url, website} = req.body;
        const updatedResource = await Task.findByIdAndUpdate(req.params.id, {url, website}, {new: true});

        if (!updatedResource)
        {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedResource);

    } catch (error) {

        res.status(500).json({message: error.message});
    }
};

//Delete resource
const deleteResource = async(req, res) => {
    try {
        const deletedResource = await Task.findByIdAndDelete(req.params.id);
        if (!deletedResource)
        {
            return res.status(404).json({message: "Task mot found"});
        }
        res.status(200).json({message: "Resource deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get resource by class ID
const getResourcesByClassId = async(req, res) => {
    try {
        const resource = await findById({classId: req.params.classId});

        if (!resource)
        {
            return res.status(404).json({ message: "Resources not found not found for this class" });
        }

        res.status(200).json(resource);


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//Create resource by class ID
const createResourceByClassId = async(req, res) => {
    try {
        const {url, website} = req.body;
        const updatedResource = await Task.findByIdAndUpdate(req.params.id, {url, website}, {new: true});
        const {classId} = req.params;

        if (!classId)
        {
            return res.status(404).json({ message: "Class ID not found" });
        }
        
        const newResource = new Resource({url, website, classId});
        const savedResource = await newResource.save();
        res.status(201).json(savedResource);

        res.status(200).json(updatedResource);

    } catch (error) {
        res.status(500).json({message: error.message});
    }

};

//Create task by Syllabus
const parseSyllabus = async (req, res) => {
    console.log("Called resourseParser controller");
    try {
        const { syllabusFilePath } = req.body;
        if (!syllabusFilePath) {
            return res.status(400).json({ message: "Syllabus file path is required." });
        }
        await parseAndSaveSyllabus(syllabusFilePath);
        res.status(200).json({ message: "Syllabus parsed and resources saved successfully." });
    } catch (error) {
        console.error("Error parsing syllabus:", error);
        res.status(500).json({ message: "An error occurred while parsing the syllabus.", error: error.message });
    }
};

export default {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    getResourcesByClassId,
    createResourceByClassId,
    parseSyllabus
};
