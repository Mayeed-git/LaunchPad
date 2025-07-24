import { S3 } from 'aws-sdk';
import fs, { access }  from 'fs';

const s3 = new S3({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    endpoint: process.env.R2_ENDPOINT!,
    region: 'auto'
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
    console.log("called");
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "launchpad",
        Key: fileName,
}).promise();
    console.log(response);
}