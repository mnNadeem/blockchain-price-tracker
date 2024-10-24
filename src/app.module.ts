import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Price } from './price/entities/price.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertModule } from './alert/alert.module';
import { Alert } from './alert/entities/alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Price, Alert],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PriceModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
