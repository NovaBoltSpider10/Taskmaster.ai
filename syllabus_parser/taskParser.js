import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs/promises";
import Task from '../models/taskModel.js';

const genAI = new GoogleGenerativeAI("AIzaSyCe-eeJM-dXKO1vmlg9qc35h_Zv6XtRdAg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


async function readSyllabus(filePath) {
  try {
    return await fs.readFile(filePath); 
    
  } catch (error) {
    console.error('Error reading syllabus', error);
    return null;
  }
}


async function extractSyllabusDataTasks(syllabusText) {
  const prompt = `
    Extract the following information which are tasks which could be assignments are test reminders from the syllabus text and put in seperate strinfigied form for each task, use ISO 8601 for data deadlines and set time to midnight unless specified, only include tasks and the points associated with it if there are any. The topic property is the unit name (should not repeat the title name at all) and the title is the name of the task:

    - Tasks { deadline: Date, topic: String, title: String, resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }], status: { type: String, enum: ['pending', 'completed', 'overdue'], default: 'pending' }, points: Number, textbook: String, class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class'}}

    provide the JSON without any surrounding text for markdown.
  `;

  const result = await model.generateContent([ 
    {
      inlineData: {
        data: Buffer.from(syllabusText).toString("base64"),
        mimeType: "application/pdf"
      }
    }, 
    prompt
  ]);
  const response = await result.response;
  let text = response.text();
  text = text.replace(/```(?:json)?\n?/g, '');
  console.log(text);
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API returned invalid JSON:', error);
    return null;
  }
}

async function saveTasksToDatabase(tasks) {
  console.log("Start of task mongose code");
  if (!tasks || !Array.isArray(tasks)) {
    console.error("Invalid tasks array provided.");
    return;
  }

  try {
    for (const tasksData of tasks) {
      const newTask = new Task(tasksData);
      await newTask.save();
    } 
    console.log(`Task "${Task.title}" saved to database.`);

  } catch(error) {
      console.error("Error saving task to database: ", error);
  }
}

async function parseAndSaveSyllabus(syllabusFilePath) {
  const syllabusText = await readSyllabus(syllabusFilePath);
  if (!syllabusText) {
      console.error("Failed to read syllabus file.");
      return;
  }

  const tasks = await extractSyllabusDataTasks(syllabusText);
  if (!tasks) {
      console.error("Failed to extract tasks from syllabus.");
      return;
  }

  await saveTasksToDatabase(tasks);
  console.log("Syllabus parsed and tasks saved successfully.");
  
}

export {extractSyllabusDataTasks, readSyllabus, saveTasksToDatabase, parseAndSaveSyllabus};