import express from "express";
import { BucketItem } from "minio";
import environment from "./environment";
import { Recording } from "./recording";
import { S3Client } from "./s3-client";
import { Response, Request } from "express";

const s3Client = new S3Client();

export class Router {
    router = express.Router();

    initializeRoutes() {
        this.router.get("/recordings", Router.listFiles);
        this.router.get("/recordings/:id", Router.getFile);
        this.router.post("/recordings", Router.scheduleRecording);
    }

    static async listFiles(req: Request, res: Response) {
        const stream = s3Client.listObjects(environment.s3.bucket, '', true);
        const recordings: BucketItem[] = [];
        stream.on('data', (data) => {
            recordings.push(data);
        })
        stream.on('end', () => {
            res.json(recordings);
        })
    }

    static async getFile(req: Request, res: Response) {
        s3Client.getObject(environment.s3.bucket, `${req.params.id}.mp4`, (_, stream) => {
            stream.pipe(res);
        });
    }

    static async scheduleRecording(req: Request, res: Response) {
        const { id, start, end } = req.body;
        const recording = new Recording(id, new Date(start), new Date(end), req.body.bitrate, req.body.resolution);
        recording.schedule();
        res.sendStatus(200);
    }
}