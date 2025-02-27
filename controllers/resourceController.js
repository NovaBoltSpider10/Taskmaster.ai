const Resource = require('../models/resourceModel');

//Get all resources
const getAllResources = async(req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get resource
const getResource = async(req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
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

module.exports = {
    getAllResources,
    getResource,
    createResource,
    updateResource,
    deleteResource
};
