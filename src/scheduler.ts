import * as schedule from 'node-schedule';
import * as FFmpeg from '@unaxiom/ffmpeg';
import environment from './environment';
import upload from './upload';


const scheduleRecording = (start: Date, end: Date, id: string) => {
  const duration = end.getTime() - start.getTime();
  const ffmpeg = new FFmpeg.FFmpeg();

  ffmpeg.addOptions([
    '-i', environment.livecam.endpoint,
    '-vcodec', 'copy',
    '-r', environment.livecam.framerate,
    '-t', `${duration}ms`,
  ]);

  ffmpeg.setOutputFile(`/output/${id}.mp4`);
  ffmpeg.setOnCloseCallback(() => {
    schedule.scheduleJob(
      new Date(start.getTime() + 1.8e+6),
      () => upload(id)
    )
  });


  schedule.scheduleJob(start, function(){
    ffmpeg.run();
  });
};

export default scheduleRecording;