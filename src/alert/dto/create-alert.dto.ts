import { IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EChain } from 'src/enums/chain.enum';

export class CreateAlertDto {
  @ApiProperty({
    description: 'The blockchain chain for the alert',
    enum: EChain,
    example: EChain.ETH,
  })
  @IsEnum(EChain, { message: 'chain must be either ETH or Polygon' })
  @IsNotEmpty({ message: 'chain is required' })
  chain: EChain;

  @ApiProperty({
    description: 'The target price for the alert',
    example: 1000,
  })
  @IsNumber({}, { message: 'targetPrice must be a number' })
  @IsNotEmpty({ message: 'targetPrice is required' })
  targetPrice: number;
}
