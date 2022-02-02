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
    stream = new Stream({
        name: 'name',
        streamUrl: environment.livecam.host,
        wsPort: 9999,
        ffmpegOptions: { 
          '-stats': '',
          '-r': 30
        }
      });

    constructor() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        this.router.initializeRoutes();

        this.express.use("/api", this.router.router);
    }

    /**
     * Starts the application
     */
    start() {
        this.express.listen(this.port, () => {
            console.log(`listening on port ${this.port}`);
        });
    }
}

const app = new App();
app.start();