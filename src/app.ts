/* eslint-disable @typescript-eslint/no-unused-vars */
import Express from 'express';
import bodyParser from "body-parser";
import { Router } from "./router";
import environment from "./environment";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stream = require('node-rtsp-stream');


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
            '-max_muxing_queue_size': 9999,
        }
      }
    stream = new Stream(this.streamOptions);

    constructor() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        this.router.initializeRoutes();

        this.express.use("/api/livecam/v1", this.router.router);

        this.stream.mpeg1Muxer.on('exitWithError', async (_data: string) => {
            this.stream.stop();

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
            });

            this.initStream();
        })
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

            await new Promise((resolve) => {
                setTimeout(resolve, 5000);
              });

            this.initStream();
        })
    }
}

const app = new App();
app.start();