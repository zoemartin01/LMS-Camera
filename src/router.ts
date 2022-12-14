import express from 'express';
import { BucketItem } from 'minio';
import environment from './environment';
import { ScheduledRecording } from './scheduled-recording';
import { Response, Request } from 'express';
import { s3Client } from './s3-client';

/**
 * The application router
 */
export class Router {
  router = express.Router();

  /**
   * Initializes the routes
   */
  initializeRoutes() {
    this.router.get('/recordings', Router.listFiles);
    this.router.get('/recordings/:id', Router.getFile);
    this.router.delete('/recordings/:id', Router.deleteFile);
    this.router.post('/recordings', Router.scheduleRecording);
  }

  /**
   * List all recording files
   *
   * @route {GET} /recordings
   * @param req backend request to get a list of all recording files
   * @param res server response to send the list of all recording files
   */
  static async listFiles(req: Request, res: Response) {
    const stream = s3Client.listObjects(environment.s3.bucket, '', true);
    const recordings: BucketItem[] = [];
    stream.on('data', (data) => {
      recordings.push(data);
    });
    stream.on('end', () => {
      res.json(recordings);
    });
  }

  /**
   * Returns the file of a recording
   *
   * @route {GET} /recordings/:id
   * @routeParam {string} id - the id of the recording
   * @param req backend request to get a recording file
   * @param res server response to send the recording file
   */
  static async getFile(req: Request, res: Response) {
    s3Client.getObject(
      environment.s3.bucket,
      `${req.params.id}.mp4`,
      (err, stream) => {
        if (err) {
          res.sendStatus(404);
          return;
        }

        res.status(200);

        stream.pipe(res);
      }
    );
  }

  /**
   * Schedules a recording
   *
   * @route {POST} /recordings
   * @bodyParam {string} id - the id of the recording
   * @bodyParam {Date} start - the start time of the recording
   * @bodyParam {Date} end - the end time of the recording
   * @bodyParam {number} bitrate - the bitrate of the recording in bytes
   * @bodyParam {string} resolution - the resolution of the recording (e.g. 1920x1080)
   * @param req backend request to schedule a recording
   * @param res server response
   */
  static async scheduleRecording(req: Request, res: Response) {
    const { id, start, end, bitrate, resolution } = req.body;
    const recording = new ScheduledRecording(
      id,
      new Date(Date.parse(start)),
      new Date(Date.parse(end)),
      bitrate,
      resolution
    );
    recording.schedule();
    res.sendStatus(201);
  }
  
  /**
   * Deletes a recording file
   * 
   * @route {DELETE} /recordings/:id
   * @routeParam {string} id - the id of the recording
   * @param req backend request to delete a recording file
   * @param res server response
   */
  static async deleteFile(req: Request, res: Response) {
    s3Client.removeObject(
      environment.s3.bucket,
      `${req.params.id}.mp4`,
      (err) => {
        if (err) {
          res.sendStatus(404);
          return;
        }

        res.sendStatus(204);
      }
    );
  }
}
