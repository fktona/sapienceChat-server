import slugify from 'slugify'; 
import db from '../../models/index.js'
import { uploadFileToDriveAndGetURL } from '../../middlewares/uploadToDrive.js';

const File = db.File;

export const uploadFile = async (req , res) => {
    const {assistant , category , purpose , title} = req.body;
    const ownerId = req.params.userId;
    const file = req.file;
    console.log('upload middleware' , req.file);

    const missingFields = ['purpose', 'category', 'assistant', 'title'].filter(field => !req.body[field]);

    if (missingFields.length) {
        return res.status(400).json({ error: `Please provide the following field(s): ${missingFields.join(', ')}` });
    }
    
    if (!file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }
    const { originalname , size } = req.file;
    const filename =  originalname.split('.')[0];
    let slug = slugify(filename, { lower: true, strict: true , locale: 'en' , replacement: '_'});
   const existingSlug = await File.findOne({ slug });    

    if (existingSlug) {
    const generateRandomString = (length) => {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        slug = slug + '_' + generateRandomString(3);
   
    }

    const filePath = req.file.path;
    const fileId = await uploadFileToDriveAndGetURL(filePath);

    try {
        await File.create({ filename, size, assistant, ownerId , title, category, purpose, slug,  fileId    });
        console.log(req.file);
        res.status(201).json({ message:filename + ' uploaded successfully Chatbot is now live' })
    } catch(err) {
        res.status(400).json({ message: 'Unable to upload ' + originalname, error: err.message });
    }
}

