FROM debian:bullseye-slim

RUN apt update && apt install -y ffmpeg wget

WORKDIR /app
COPY rtsp-simple-server.yml /app/
COPY recording.mp4 /app/

RUN wget https://github.com/aler9/rtsp-simple-server/releases/download/v0.17.11/rtsp-simple-server_v0.17.11_linux_amd64.tar.gz
RUN tar -xzf rtsp-simple-server_v0.17.11_linux_amd64.tar.gz

CMD ["./rtsp-simple-server"]