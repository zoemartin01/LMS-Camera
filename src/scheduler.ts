import { exec } from 'child_process';

export class Scheduler {
  start: Date;
  end: Date;


  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }

  async schedule() {
    const date = `${this.start.getHours()}:${this.start.getMinutes()} ${this.start.getFullYear()}-${this.start.getMonth()}-${this.start.getDate()}`;

    exec(`at ${date} -f ./record.sh`, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      }
    
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
}

new Scheduler(new Date(), new Date()).schedule();