
import mongoose from "mongoose";
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstname:{
       type:String,
        required: false,
        trim: true,
    },
    lastname:{
      type: String,
       required: false,
       trim: true,
   },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    verification:{
      type:Boolean,
      required:true
    }
  })
);

export default User;  