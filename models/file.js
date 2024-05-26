import mongoose from 'mongoose'; 

const fileSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    size: {
        type: Number,
        required: true
    },
    assistant:{
        type:String,
        required:true
    }
});

const File = mongoose.model('File', fileSchema);

export default File;