import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import { promisify } from 'util';
import { RedisClient } from 'redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClient;
  private getAsync;

  constructor(private configService: ConfigService) {
    this.client = redis.createClient({
      port: +this.configService.get<string>('QUEUE_PORT'),
      host: this.configService.get<string>('QUEUE_HOST'),
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
  }

  setKey(k, v, flag, time = null): void {
    if (flag) {
      this.client.set(k, v, 'EX', time || 16200);
    } else {
      this.client.set(k, v);
    }
  }

  async getKey(k: string): Promise<string> {
    return this.getAsync(k);
  }
}
