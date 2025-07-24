
import express from 'express';
import cors from "cors";
import simpleGit from 'simple-git';
import { generate } from './utils';
import path from 'path';
import { getAllFiles } from './file';
import { uploadFile } from './aws'; 
import { createClient } from 'redis';

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();


const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    await Promise.all(
        files.map(async file => {
            // Add this: Fix the file path for S3 key
            const relativePath = path.relative(path.join(__dirname, `output/${id}`), file);
            const s3Key = `output/${id}/${relativePath.replace(/\\/g, '/')}`;
            await uploadFile(s3Key, file);
        })
    );

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded")

    res.json({
        id: id
    })
});

app.get("/status", async(req, res) =>{
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);

