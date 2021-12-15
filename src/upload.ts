import fs from 'fs';
import environment from './environment';
import s3Client from './s3';

const upload = (id: string) => {
  const path = `output/${id}.mp4`;
  const stream = fs.createReadStream(path);

  fs.stat(path, (err, stats) => {
    if (err) return
    s3Client.putObject(environment.s3.bucket, `%{id}.mp4`, stream, stats.size, function(err, _) {
      if (err) return
      fs.unlinkSync(path);
    })
  });
};

export default upload;