import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({ summary: 'Set price alert' })
  @ApiBody({ type: CreateAlertDto, description: 'Set an alert for a price' })
  @ApiResponse({ status: 201, description: 'Alert created successfully' })
  @Post()
  async setPriceAlert(@Body() alertDto: CreateAlertDto): Promise<Alert> {
    return this.alertService.create(alertDto);
  }
}
