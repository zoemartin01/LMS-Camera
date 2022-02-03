import ffmpeg from 'fluent-ffmpeg';
import environment from './environment';
import { ScheduledRecording } from './scheduled-recording';
import * as schedule from 'node-schedule';
import path from 'path';

export class Recorder {
  scheduledRecording: ScheduledRecording;

  constructor(scheduledRecording: ScheduledRecording) {
    this.scheduledRecording = scheduledRecording;
  }

  run() {
    const filePath = path.resolve(`${environment.recording_path}/${this.scheduledRecording.id}.mp4`);

    ffmpeg(environment.livecam.host)
    .videoCodec('libx264')
    .videoBitrate(this.scheduledRecording.bitrate)
    .size(this.scheduledRecording.resolution)
    .fps(+environment.livecam.framerate || 25)
    .duration(`${this.scheduledRecording.duration}ms`)
    .addOptions([
      '-rtsp_transport tcp',
    ])
    .on('end', () => {
      this.scheduledRecording.upload();
    })
    .on('error', (_err, _stdout, _stderr) => {
      console.error(_err);
      this.scheduledRecording.upload();
    })
    .save(filePath);
}

  schedule() {
    schedule.scheduleJob(this.scheduledRecording.start, () => {
      this.run();
    });
  }
}
