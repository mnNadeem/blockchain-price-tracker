import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { IHourlyPrice } from 'src/types/hourly-price.interface';
import { SwapDto } from './dto/swap.dto';
import { ISwapResponse } from 'src/types/swap.response';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @ApiOperation({ summary: 'Get prices from the last 24 hours' })
  @ApiResponse({ status: 200, description: 'Prices retrieved successfully' })
  @Get('last-24-hours')
  async getPricesLast24Hours(): Promise<IHourlyPrice[]> {
    return this.priceService.getPricesLast24Hours();
  }

  @ApiOperation({ summary: 'Get ETH to BTC swap rate' })
  @ApiBody({ type: SwapDto, description: 'Input ETH amount to get swap rate' })
  @ApiResponse({
    status: 200,
    description: 'Swap rate calculated successfully',
  })
  @Post('swap-rate')
  async getSwapRate(@Body() swapDto: SwapDto): Promise<ISwapResponse> {
    return this.priceService.getSwapRate(swapDto.ethAmount);
  }
}
