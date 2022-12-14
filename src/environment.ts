const environment = {
    recording_path: './output',
    port: 7000,
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJaalZsT1RrMVlqRXROakl3T1MwME1ETTRMV0ZpTlRjdFpUSTFZMlEzTVdJd05qWm0ifQ.wiAd8rTGq1xh4rYirxBPm9BwhKQK-xKN7261NFWWMFE',
    s3: {
        host: process.env.S3_HOST || 'localhost',
        port: process.env.S3_PORT || 9000,
        accessKey: process.env.S3_USERNAME || 'minio',
        secretKey: process.env.S3_PASSWORD || 'minio123',
        bucket: 'livecam',
    },
    livecam: {
        host: process.env.RTSP_URL || 'rtsp://admin:psege2022@192.168.0.184:554//h265Preview_01_main',
        framerate: process.env.RTSP_FPS || 0,
        bitrate: process.env.RTSP_BITRATE || '8192',
    },
    backend: {
        host: process.env.BACKEND_HOST || 'http://localhost:3000',
        api: process.env.BACKEND_PATH || '/api/v1',
        patchEndpoint: '/livecam/recordings/:id',
        getSchedulesEndpoint: '/livecam/recordings/schedules',
    }
}

export default environment;