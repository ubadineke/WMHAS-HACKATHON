import randomDigits from './generateRandomDigits';
import cloudinary from '../config/cloudinary';

//path parameter indicates folder to store picture eg. staff_pictures,
export async function uploadSingleImage(file: any, name: string, path: string) {
    const uploads = Array.isArray(file) ? file : [file];
    if (uploads.length > 1) throw new Error('Function only works for single file upload');
    const filePath = uploads[0].path;

    const result = await cloudinary.uploader.upload(filePath, {
        folder: `${path}/`,
        format: 'webp',
        quality: '80',
        public_id: `${name}_${randomDigits(5)}`, //the file name is generated from these details
    });

    return result;
}

export async function uploadMultipleImage(files: any, fileName: string, path: string) {
    const uploads = Array.isArray(files) ? files : [files];
    // if (uploads.length < 2) {
    //     throw new Error('Function only works for multiple images');
    // }

    const uploadPromises = uploads.map(async (file: any) => {
        return uploadSingleImage(file, fileName, path);
    });

    const cloudinaryResult = await Promise.all(uploadPromises);
    const cloudinaryUrls = cloudinaryResult.map((result) => result.secure_url);
    return { cloudinaryUrls, cloudinaryResult };
}
