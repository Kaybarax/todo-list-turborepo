import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    // eslint-disable-next-line no-unused-vars
    private readonly appService: AppService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ status: 200, description: 'API information retrieved successfully' })
  getHello(): { message: string; version: string; timestamp: string } {
    return this.appService.getHello();
  }
}
