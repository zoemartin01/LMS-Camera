const environment = {
    production: false,
    recording_path: './output',
    s3: {
        host: 'localhost',
        port: 9000,
        accessKey: 'minio',
        secretKey: 'minio123',
        bucket: 'livecam',
    },
    livecam: {
        host: 'rtsp://localhost:8554/stream',
        framerate: 25,
    },
    backend: {
        host: 'http://localhost:3000',
        api: '/api/v1',
        patchEndpoint: '/livecam/recordings/:id',
    }
}

export default environment;