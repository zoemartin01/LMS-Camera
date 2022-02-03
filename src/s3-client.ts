import { Client } from "minio";
import environment from "./environment";

const options = {
  endPoint: environment.s3.host,
  port: +environment.s3.port,
  accessKey: environment.s3.accessKey,
  secretKey: environment.s3.secretKey,
  useSSL: false
}

/**
 * The S3 client
 */
export class S3Client extends Client {
  constructor() {
    super(options);

    this.bucketExists(environment.s3.bucket).then(async exists => {
      if (!exists) await this.makeBucket(environment.s3.bucket, '');
    });
  }
}

export const s3Client = new S3Client();