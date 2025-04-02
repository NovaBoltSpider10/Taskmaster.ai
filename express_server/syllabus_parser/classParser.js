import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import Class from '../models/classModel.js';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.Google_GenAI_URL);
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
    Extract the following information which is the class info from syllabus:

    - Classes: {
        professor: String, 
        timing: String (timing of class),
        examDates: [Date] (dates of all exams, ISO 8601 for data deadlines and set to 11:59 pm),
        topics: [String] (string of all units),
        gradingPolicy: String (string of grading policy),
        contactInfo: String (string of only email),
        textbooks: [String] (string array of the textbooks to buy),
        location: String (String of room location),
        resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }] (leave blank),
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }] (leave blank),
    
    }
    provide the JSON without any surrounding text for markdown.
  `;

  const result = await model.generateContent([ 
    {
      inlineData: {
        data: syllabusText.toString("base64"),
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

async function saveClassesToDatabase(classes) {
  console.log("Start of class mongose code");
  

  try {
    const newClass = new Class(classes);
    await newClass.save();
    console.log(`Class "${Class.title}" saved to database.`);

  } catch(error) {
      console.error("Error saving class to database: ", error);
  }
}

async function parseAndSaveSyllabus(syllabusFilePath) {
  const syllabusText = await readSyllabus(syllabusFilePath);
  if (!syllabusText) {
      console.error("Failed to read syllabus file.");
      return;
  }

  const classText = await extractSyllabusDataTasks(syllabusText);
  if (!classText) {
      console.error("Failed to extract classes from syllabus.");
      return;
  }

  await saveClassesToDatabase(classText);
  console.log("Syllabus parsed and classes saved successfully.");
  
}


export {extractSyllabusDataTasks, readSyllabus, saveClassesToDatabase, parseAndSaveSyllabus};