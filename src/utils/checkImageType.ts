import { Request } from 'express';
// import { AppError } from '../config/exception';

//Checks image type
//This setup works for both single and multiple image uploads

export default function checkImageType(req: Request) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const files: any = req.files?.image;

    const fileArray = Array.isArray(files) ? files : [files]; //checks and returns if it is an array or makes it an array

    fileArray.forEach((file) => {
        if (!allowedTypes.includes(file.type)) throw new Error(`Invalid file type: ${file.type}`);
    });
}
