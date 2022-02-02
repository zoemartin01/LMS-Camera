const environment = {
    recording_path: './output',
    port: 7000,
    s3: {
        host: process.env.S3_HOST || 'localhost',
        port: process.env.S3_PORT || 9000,
        accessKey: process.env.S3_USERNAME || 'minio',
        secretKey: process.env.S3_PASSWORD || 'minio123',
        bucket: 'livecam',
    },
    livecam: {
        host: process.env.RTSP_URL || 'rtsp://localhost:8554/stream',
        framerate: process.env.RTSP_FPS || 25,
        bitrate: process.env.RTSP_BITRATE || '500k',
    },
    backend: {
        host: process.env.BACKEND_HOST || 'http://localhost:3000',
        api: process.env.BACKEND_PATH || '/api/v1',
        patchEndpoint: '/livecam/recordings/:id',
    }
}

export default environment;