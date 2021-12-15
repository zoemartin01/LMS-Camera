import express from "express";
import environment from "./environment";
import { BucketItem } from 'minio'
import s3Client from "./s3";
import scheduleRecording from "./scheduler";

const port = 7000;
const app = express();

app.get("/recordings", async (_, res) => {
    const stream = s3Client.listObjects(environment.s3.bucket, '', true);
    const recordings: BucketItem[] = [];
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

app.post("/recordings", async (req, res) => {
    const { id, start, end } = req.body;

    scheduleRecording(new Date(start), new Date(end), id);
    res.status(200);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});