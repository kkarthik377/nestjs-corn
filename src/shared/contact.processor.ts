import { OnQueueActive, OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppService } from 'src/app.service';

@Processor('contactJob')
export class ContactProcessor {

  private readonly logger = new Logger(ContactProcessor.name);

  constructor(private readonly appService: AppService){
  }

  @Process('contact')
  async handleNotification(job: Job) {
    this.logger.debug('Start job...');
    const contact = job.data
    try {
      console.log(contact);
      await timer(2000).pipe(take(1)).toPromise();
      this.logger.debug('Job completed');
    } catch(err) {
      this.logger.debug('Job failed');
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.data}`,
    );
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job, result: any) {
    console.log(
      `completed job ${job.data}`,
    );
    console.log(result);
    const count = await this.appService.getCurrentCount();
    const activeCount = await this.appService.getActiveCount();
    console.log(count);
    console.log(activeCount);
    if (!activeCount) {
      // Process next CSV file
      this.appService.generateReport();
    }
  }
}