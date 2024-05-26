import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './routes/AUTH/index.js';  
import db from './models/index.js';
import chat from './routes/chat/index.js';
import { AIChat } from './llm/setup.js';
import { config } from 'dotenv';
const app = express();
app.use(express.json());
app.use(cors());





app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
app.use('/api/auth' , auth)
app.use('/api', chat)
const Role = db.role;
db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    //initial();
    app.listen(PORT , () => {
        console.log(`Server running on port ${PORT}`);
    })
    
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });



