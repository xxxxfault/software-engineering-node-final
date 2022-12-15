import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import {s3} from "./AwsDaos";

export const upload = multer({
    // Indicates S3 bucket as the storage location to Multer.
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,

        // Auto-detects file content type.
        contentType: multerS3.AUTO_CONTENT_TYPE,

        // Uses form field name as file metadata.
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // Generates a time-based file key.
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // Filters for .jpeg, .jpg, .png files.
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extnameIsValid = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetypeIsValid = filetypes.test(file.mimetype);
        if (extnameIsValid && mimetypeIsValid) {
            return cb(null, true);
        } else {
            cb("Error: Allow images only of extensions jpeg|jpg|png !");
        }
    }
});