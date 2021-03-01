import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/contacts')
  @HttpCode(200)
  async contact(@Body() data: any, @Res() res: Response): Promise<any> {
    const count = await this.appService.getCurrentCount();
    if (count.waiting) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Already queue in progress'
      }, HttpStatus.BAD_REQUEST);
    }
    res.status(200).json({message: 'Script started'});
    this.appService.processJob(data);
  }
}
