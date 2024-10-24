import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SwapDto {
  @ApiProperty({
    description: 'Amount of Ethereum to swap',
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  ethAmount: number;
}
