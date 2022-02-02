import ffmpeg from 'fluent-ffmpeg';
import environment from './environment';
import { ScheduledRecording } from './scheduled-recording';
import * as schedule from 'node-schedule';

export class Recorder {
  scheduledRecording: ScheduledRecording;

  constructor(scheduledRecording: ScheduledRecording) {
    this.scheduledRecording = scheduledRecording;
  }

  run() {
    ffmpeg(environment.livecam.host)
    .videoCodec('copy')
    //.videoBitrate(this.bitrate)
    //.size(this.resolution)
    //.autopad()
    // TODO: fix bad sectors
    .fps(+environment.livecam.framerate || 25)
    .duration(`${this.scheduledRecording.duration}ms`)
    .output(`${environment.recording_path}/${this.scheduledRecording.id}.mp4`)
    .on('end', () => {
      this.scheduledRecording.upload();
    })
    .on('error', (_err, _stdout, _stderr) => {
      this.scheduledRecording.upload();
    }).run();
}

  schedule() {
    schedule.scheduleJob(this.scheduledRecording.start, () => {
      this.run();
    });
  }
}
