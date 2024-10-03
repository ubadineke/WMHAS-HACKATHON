import formidable from 'express-formidable';

//Allow for upload of a single image only with a max size of 1MB
export const uploadSingle = formidable({
    maxFileSize: 1 * 1024 * 1024,
    multiples: false,
});

export const uploadMultiple = formidable({
    maxFileSize: 1 * 1024 * 1024,
    multiples: true,
});
