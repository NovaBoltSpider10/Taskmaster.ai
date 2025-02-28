const Calendar = require('../models/calendarModel');

//Get all calendars
const getAllCalendar = async(req, res) => {
    try {
        const calendars = await Calendar.find();
        res.status(200).json(calendars);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Get calendar by ID
const getCalendarById = async(req, res) => {
    try {
        const calendars = await Calendar.findById(req.params.id);
        if (!calendars)
        {
            return res.status(404).json({ message: "Calendar not found" });
        }

        res.status(200).json(calendars);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Create calendar
const createCalendar = async(req, res) => {
    try {
        const {classes, task, holidays, outlookEvents} = req.body;

        const newCalendar = new Calendar({classes, task, holidays, outlookEvents});
        const savedCalendar = await newCalendar.save();
        res.status(201).json(savedCalendar);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Update calendar
const updateCalendar = async(req, res) => {
    try {
        const {classes, task, holidays, outlookEvents} = req.body;
        const updatedCalendar = await Calendar.findByIdAndUpdate(req.params.id, {classes, task, holidays, outlookEvents}, {new: true});

        if (!updatedCalendar)
        {
            return res.status(404).json({ message: "Calendar not found" });
        }

        res.status(200).json(updatedCalendar);

    } catch (error) {

        res.status(500).json({message: error.message});
    }
};

//Delete calendar
const deleteCalendar = async(req, res) => {
    try {
        const deletedCalendar = await Calendar.findByIdAndDelete(req.params.id);
        if (!deletedCalendar)
        {
            return res.status(404).json({message: "Calendar not found"});
        }
        res.status(200).json({message: "Calendar deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    createCalendar,
    getAllCalendar,
    getCalendarById,
    updateCalendar,
    deleteCalendar
};
