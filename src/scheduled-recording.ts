import * as schedule from 'node-schedule';
import environment from './environment';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import fs from 'fs';
import { s3Client } from './s3-client';

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
    const job = ffmpeg(environment.livecam.host)
    .videoCodec('copy')
    //.videoBitrate(this.bitrate)
    //.size(this.resolution)
    //.autopad()
    .fps(environment.livecam.framerate)
    .duration(`${this.duration}ms`)
    .output(`${environment.recording_path}/${this.id}.mp4`)
    .on('end', () => {
      this.upload();
    })
    .on('error', (_err, _stdout, _stderr) => {
      this.upload();
    })

    schedule.scheduleJob(this.start, () => {
      job.run();
    });
  }

  /**
   * Uploads the recording to S3
   */
  upload() {
    const path = `${environment.recording_path}/${this.id}.mp4`;
    const stream = fs.createReadStream(path);

    fs.stat(path, (err, stats) => {
      if (err) return
      s3Client.putObject(environment.s3.bucket, `${this.id}.mp4`, stream, stats.size, function(err, _) {
        if (err) return
        fs.unlinkSync(path);
      })
      axios.patch(
        `${environment.backend.host}${environment.backend.api}${environment.backend.patchEndpoint.replace(':id', this.id)}`,
        {
          size: stats.size,
        });
    });
  }
}