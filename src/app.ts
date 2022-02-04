/* eslint-disable @typescript-eslint/no-unused-vars */
import Express from 'express';
import bodyParser from 'body-parser';
import { Router } from './router';
import environment from './environment';
import axios, { AxiosResponse } from 'axios';
import { ScheduledRecording } from './scheduled-recording';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stream = require('node-rtsp-stream');

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * The application with web server
 */
export class App {
  express = Express();
  router = new Router();
  port = environment.port;
  streamOptions = {
    name: 'name',
    streamUrl: environment.livecam.host,
    wsPort: 9999,
    ffmpegOptions: {
      '-hide_banner': '',
      '-loglevel': 'error',
      '-r': 30,
      '-b:v': environment.livecam.bitrate,
      '-reconnect': 1,
      '-reconnect_at_eof': 1,
      '-reconnect_streamed': 1,
      '-reconnect_delay_max': 2,
      '-max_muxing_queue_size': 9999,
    },
  };
  stream: typeof Stream;

  constructor() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.router.initializeRoutes();

    this.express.use('/api/livecam/v1', this.router.router);

    axios.defaults.headers.common['Authorization'] = `Bearer ${environment.apiKey}`;

    this.initStream();
    this.initRecordingSchedules();
  }

  /**
   * Starts the application
   */
  start() {
    this.express.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }

  initStream() {
    this.stream = new Stream(this.streamOptions);

    this.stream.mpeg1Muxer.on('exitWithError', async (_data: string) => {
      this.stream.stop();
      await sleep(5000);
      this.initStream();
    });
  }

  async initRecordingSchedules() {
    let done = false;

    while (!done) {
      let res: AxiosResponse;

      try {
        res = await axios.get(
          `${environment.backend.host}${environment.backend.api}${environment.backend.getSchedulesEndpoint}`
        );
      } catch (error) {
        console.log(error);
        await sleep(5000);
        continue;
      }

      if (res.status !== 200) {
        await sleep(5000);
        continue;
      }

      const recordingSchedules = res.data.data;

      for (const recordingSchedule of recordingSchedules) {
        const { id, start, end, bitrate, resolution } = recordingSchedule;
        const recording = new ScheduledRecording(
          id,
          new Date(Date.parse(start)),
          new Date(Date.parse(end)),
          bitrate,
          resolution
        );
        recording.schedule();
      }
      done = true;
    }
  }
}

const app = new App();
app.start();
