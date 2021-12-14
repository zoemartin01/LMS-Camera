import fs from 'fs';
import environment from './environment';
import s3Client from './s3';

const path = process.argv[2];
const fileName = path.split('/').pop();
const stream = fs.createReadStream(path);

fs.stat(path, (err, stats) => {
  if (err) return
  s3Client.putObject(environment.s3.bucket, fileName!, stream, stats.size, function(err, _) {
    if (err) return
    fs.unlinkSync(path);
  })
});