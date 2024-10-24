import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Returns a welcome message' })
  @ApiResponse({ status: 200, description: 'Successfully returns a message' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
