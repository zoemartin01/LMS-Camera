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
}

export default environment;