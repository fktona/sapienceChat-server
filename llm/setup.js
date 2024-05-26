import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { VertexAI } from "@langchain/google-vertexai";
import { PromptTemplate } from "@langchain/core/prompts";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import 'dotenv/config';
import path from 'path';
import { google } from 'googleapis';
import db from '../models/index.js';

const File = db.File;

export const getGoogleDriveFile = async (fileId) => {
   
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'service.json'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const { data } = await drive.files.get({
      fileId,
      alt: 'media'
  }, { responseType: 'blob' });
  


    return data
  } catch (error) {
    console.error('Error retrieving file from Google Drive:', error);
    throw error;
  }
};


export const AIChat = async (clientQuestion , fileId) => {
  try {
    console.log('Starting AI Chat...');

  
    const splitter = new RecursiveCharacterTextSplitter({
      splitCharacters: ["\n", ".", "?", "!"],
      minCharacters: 10,
      splitPages: true,
    });


    const pdfBlob = await getGoogleDriveFile(fileId);
    

    
    const pdfDoc =  new WebPDFLoader(pdfBlob,{
      splitPages:true
    });
    const pdfText = await pdfDoc.load();
    
    const docText = await splitter.splitDocuments(pdfText);
    

    const vectorStore = await MemoryVectorStore.fromDocuments(
      pdfText,
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyDIY5BcyWkgHA_HdmwbEIEJysPwVGkxZOw'
      })
    );

    const model = new VertexAI();

  
    const promptTemplate = PromptTemplate.fromTemplate(
      'Given a question, convert it to a standalone question: {question}'
    );
    const answerTemplate = PromptTemplate.fromTemplate(
      `
      You are a helpful and enthusiastic support chatbot who can provide answers to the question provided 
      based on the context provided and answer in a way the user will not know you are replying from a context. 
      Always reply  in a lively, funny, and friendly way, and if you cannot provide the answer, 
      look for a close match max your answer not toolong short maybe.
      Question: {question}
      Context: {context}
      Answer:
      `
    );

    
    const retrival = vectorStore.asRetriever(12);
    const serializeDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n");
  
  
    const chains = RunnableSequence.from([
      {
        question: new RunnablePassthrough(),
        
        
      },
      promptTemplate,
      model,
      new StringOutputParser(),
      {
      
        question: prev => prev,
        context: retrival.pipe(serializeDocs)
      },
      
      answerTemplate,
      model,
      new StringOutputParser(),
      
    
    
    ])
    const result = await chains.invoke(clientQuestion)
    console.log(result);
    return result
    }
    catch (error) {
      console.error('Error in AI Chat:', error);
      throw error;
    }
  };