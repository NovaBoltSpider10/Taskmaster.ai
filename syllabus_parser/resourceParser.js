import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs/promises";
import Resource from '../models/resourceModel.js';
import mongoose from "mongoose";
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
    Extract the following information which are resource urls which could be any links are helpful information such as guides in the syllabus:

    - resource {
        urls: [String] (String array of all the url to websites and other helpful places),
        class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: false (just set to null)}
    }
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

async function saveResourceToDatabase(resources) {
  console.log("Start of resource mongose code");

  try {  
    const newResource = new Resource(resources);
    await newResource.save();
     
    console.log(`Resource "${Resource.title}" saved to database.`);

  } catch(error) {
      console.error("Error saving resource to database: ", error);
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
      console.error("Failed to extract resource from syllabus.");
      return;
  }

  await saveResourceToDatabase(tasks);
  console.log("Syllabus parsed and resources saved successfully.");
  
}

export {extractSyllabusDataTasks, readSyllabus, saveResourceToDatabase, parseAndSaveSyllabus};