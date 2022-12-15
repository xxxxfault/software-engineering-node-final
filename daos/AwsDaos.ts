// Configures and connects to AWS S3 image storage.

import AWS from "aws-sdk";

export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_KEY_ID,
    secretAccessKey: process.env.AWS_S3_KEY,
    region: process.env.AWS_REGION
});