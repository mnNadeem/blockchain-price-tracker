import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertService {
  constructor(@InjectRepository(Alert) private alertRepo: Repository<Alert>) {}
  async create(createAlertDto: CreateAlertDto): Promise<Alert> {
    try {
      const newAlert = this.alertRepo.create(createAlertDto);

      if (!newAlert) {
        throw new HttpException(
          'Could not create Alert',
          HttpStatus.BAD_REQUEST,
        );
      }

      const alert = await this.alertRepo.save(newAlert);

      if (!alert) {
        throw new HttpException('Could not save Alert', HttpStatus.BAD_REQUEST);
      }

      return alert;
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.alertRepo.find();
  }
}
