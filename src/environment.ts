const environment = {
    production: false,
    apiUri: 'api/v1',
    s3: {
        endpoint: 'localhost',
        port: 9000,
        accessKey: 'minio',
        secretKey: 'minio123',
        bucket: 'livecam',
    },
    livecam: {
        endpoint: 'localhost',
        framerate: '25',
    }
}

export default environment;