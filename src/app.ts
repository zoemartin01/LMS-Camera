import express from "express";
import environment from "./environment";
import { BucketItem } from 'minio'
import s3Client from "./s3";

const port = 7000;
const app = express();

app.get("/recordings", async (_, res) => {
    const stream = s3Client.listObjects(environment.s3.bucket, '', true);
    let recordings: BucketItem[] = [];
    stream.on('data', (data) => {
        recordings.push(data);
    })
    stream.on('end', () => {
        res.json(recordings);
    })
});

app.get("/recordings/:id", async (req, res) => {
    s3Client.getObject(environment.s3.bucket, `${req.params.id}.mp4`, (_, stream) => {
        stream.pipe(res);
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});