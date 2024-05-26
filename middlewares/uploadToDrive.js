import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';


export const uploadFileToDriveAndGetURL = async (filePath) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(process.cwd(), 'service.json'),
        scopes: ['https://www.googleapis.com/auth/drive']
    });

    const drive = google.drive({ version: 'v3', auth });

    const response = await drive.files.create({
        requestBody: {
            name: path.basename(filePath), 
            mimeType: 'application/pdf' 
        },
        media: {
            mimeType: 'application/pdf', 
            body: fs.createReadStream(filePath) 
        }
    });

    
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    });


    console.log(response.data.id);
    return response.data.id;
};
