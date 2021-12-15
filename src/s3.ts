import { Client } from "minio";
import environment from "./environment";

const s3Client = new Client({
    endPoint: environment.s3.host,
    port: environment.s3.port,
    accessKey: environment.s3.accessKey,
    secretKey: environment.s3.secretKey,
    useSSL: false
});

export default s3Client;