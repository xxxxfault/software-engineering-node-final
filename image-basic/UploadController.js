import multer from 'multer';
import multerS3 from 'multer-s3-v2';
import path from 'path';
import s3 from './awsDao';

const upload = multer({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // META DATA FOR PUTTING FIELD NAME
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function(req, file, cb) {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    }),
    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Allow images only of extensions jpeg|jpg|png !");
        }
    }
});

// How upload will be call

// Route:
// router.route("/portfolio/:userId")
//     .post(upload.single('photo'), PhotoController.apiPostPhoto)

// Controller:
// async apiPostPhoto(req, res, next) {
//     try {
//         const name = req.body.user_name;
//         const id = req.body.user_id;
//         const photo_name = req.body.photo_name;
//         const AWSKey = req.file.key;
//         const filePath = req.file.location;
//         const date = new Date();
//         const photoId = await PhotoDAO.addPhoto(
//             name,
//             id,
//             photo_name,
//             filePath,
//             AWSKey,
//             date
//         );
//         var { error } = photoId;
//         console.log(error);
//         if (error) {
//             res.status(500).json({ error: "Unable to post photo." });
//         } else {
//             res.json(photoId);
//         }
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// }

export default upload;