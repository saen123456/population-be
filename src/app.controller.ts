import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    this.getDataFromExcel();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  async getDataFromExcel() {
    return this.appService.getDataFromExcel();
  }
}