import * as schedule from 'node-schedule';
import environment from './environment';
import upload from './upload';
import ffmpeg from 'fluent-ffmpeg';



const scheduleRecording = async (start: Date, end: Date, id: string) => {
  const duration = end.getTime() - start.getTime();  
  const record = ffmpeg(environment.livecam.host)
    .videoCodec('copy')
    //.videoBitrate('1000k')
    .fps(environment.livecam.framerate)
    .duration(`${duration}ms`)
    .output(`${environment.recording_path}/${id}.mp4`)
    .on('end', () => {
      upload(id);
    })
    .on('error', (_err, _stdout, _stderr) => {
      upload(id);
    });

  schedule.scheduleJob(start, async () => {
    record.run();
  });
};

export default scheduleRecording;