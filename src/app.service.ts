import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import * as _ from 'lodash';
import { RedisService } from './shared/redis.service';

@Injectable()
export class AppService {

  private readonly logger = new Logger(AppService.name);

  constructor(@InjectQueue('contactJob') private readonly contactQueue: Queue, private redisService: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async processJob(data) {
    this.redisService.setKey('CURRENT_FILE_ID', data.id, false);
    _.forEach(data.contact, (value) => {
      return this.addContactToQueue(value);
    });
  }

  async addContactToQueue(contact) {
    this.logger.debug('Adding contact to job');
    return this.contactQueue.add('contact', contact);
  }

  async getCurrentCount() {
    return this.contactQueue.getJobCounts();
  }

  async getActiveCount() {
    return this.contactQueue.getActiveCount();
  }

  async generateReport() {
    const currentFileId = await this.redisService.getKey('CURRENT_FILE_ID');
    console.log('Current file ID', currentFileId);
    console.log('Process next CSV file');

    // After processing curent file, we need to check DB for next file
  }
}
