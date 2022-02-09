import environment from './environment';
import axios from 'axios';
import fs from 'fs';
import { s3Client } from './s3-client';
import { Recorder } from './recorder';
import path from 'path';

/**
 * A scheduled recording
 */
export class ScheduledRecording {
  id: string;
  start: Date;
  end: Date;
  bitrate: number;
  resolution: string;
  duration: number;

  /**
   * Constructor
   * @param id the id of the recording
   * @param start the start time of the recording
   * @param end the end time of the recording
   * @param bitrate the bitrate of the recording in bytes
   * @param resolution the resolution of the recording (e.g. 1920x1080)
   */
  constructor(id: string, start: Date, end: Date, bitrate: number, resolution: string) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.bitrate = bitrate;
    this.resolution = resolution;
    this.duration = end.getTime() - start.getTime();  
  }

  /**
   * Schedules the recording
   */
  schedule() {
    const recorder = new Recorder(this);
    recorder.schedule();
  }

  /**
   * Uploads the recording to S3
   */
  upload() {
    const filePath = path.resolve(`${environment.recording_path}/${this.id}.mp4`);
    const stream = fs.createReadStream(filePath);

    fs.stat(filePath, (err, stats) => {
      if (err) return
      s3Client.putObject(environment.s3.bucket, `${this.id}.mp4`, stream, stats.size, function(err, _) {
        if (err) return
        fs.unlinkSync(filePath);
      })
      axios.patch(
        `${environment.backend.host}${environment.backend.api}${environment.backend.patchEndpoint.replace(':id', this.id)}`,
        {
          size: stats.size,
        });
    });
  }
}