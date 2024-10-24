import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { EmailService } from 'src/email/email.service';
import { PriceController } from './price.controller';
import { AlertService } from 'src/alert/alert.service';
import { Alert } from 'src/alert/entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Price, Alert])],
  controllers: [PriceController],
  providers: [PriceService, EmailService, AlertService],
  exports: [PriceService],
})
export class PriceModule {}
