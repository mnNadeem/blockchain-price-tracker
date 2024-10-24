import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Price } from './entities/price.entity';
import { Cron } from '@nestjs/schedule';
import Moralis from 'moralis';
import { EmailService } from 'src/email/email.service';
import { IHourlyPrice } from 'src/types/hourly-price.interface';
import { EOrder } from 'src/enums/order.enum';
import { EChain } from 'src/enums/chain.enum';
import { AlertService } from 'src/alert/alert.service';
import {
  BTC_RATE,
  CHAINS,
  CRON_EXPRESSION,
  FEE_PERCENTAGE,
} from 'src/constansts/constant';
import { ISwapResponse } from 'src/types/swap.response';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price) private priceRepo: Repository<Price>,
    private readonly alertService: AlertService,
    private readonly emailService: EmailService,
  ) {}

  async startMoralis() {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }

  @Cron(CRON_EXPRESSION)
  async fetchPrices() {
    try {
      await this.startMoralis();
      const ethPrice = await this.getEthPrice();
      const polygonPrice = await this.getPolygonPrice();

      await this.priceRepo.save({ chain: EChain.ETH, price: ethPrice });
      await this.priceRepo.save({ chain: EChain.Polygon, price: polygonPrice });

      await this.checkPriceAlerts(ethPrice, polygonPrice);

      const alerts = await this.alertService.findAll();
      for (const alert of alerts) {
        if (
          alert.chain === EChain.ETH &&
          ethPrice >= alert.targetPrice * 1.03
        ) {
          await this.emailService.sendEmail(
            EChain.ETH,
            ethPrice,
            alert.targetPrice,
          );
        } else if (
          alert.chain === EChain.Polygon &&
          polygonPrice >= alert.targetPrice * 1.03
        ) {
          await this.emailService.sendEmail(
            EChain.Polygon,
            polygonPrice,
            alert.targetPrice,
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async getEthPrice(): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: CHAINS.ETH.address,
        include: 'percent_change',
        address: process.env.EVM_ADDRESS_INPUT,
      });

      return response.raw.usdPrice;
    } catch (error) {
      throw error;
    }
  }

  private async getPolygonPrice(): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: CHAINS.POLYGON.address,
        include: 'percent_change',
        address: process.env.EVM_ADDRESS_INPUT,
      });

      return response.raw.usdPrice;
    } catch (error) {
      throw error;
    }
  }

  private async checkPriceAlerts(ethPrice: number, polygonPrice: number) {
    const now = new Date();
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);

    const pastPrices = await this.priceRepo.find({
      where: {
        createdAt: Between(oneHourAgo, now),
      },
      order: {
        createdAt: 'DESC',
      },
      take: 2,
    });

    const pastEthPrice = pastPrices.find(
      (price) => price.chain === EChain.ETH,
    )?.price;
    const pastPolygonPrice = pastPrices.find(
      (price) => price.chain === EChain.Polygon,
    )?.price;

    if (pastEthPrice && ethPrice > pastEthPrice * 1.03) {
      await this.emailService.sendEmail(EChain.ETH, ethPrice, pastEthPrice);
    }

    if (pastPolygonPrice && polygonPrice > pastPolygonPrice * 1.03) {
      await this.emailService.sendEmail(
        EChain.Polygon,
        polygonPrice,
        pastPolygonPrice,
      );
    }
  }

  async getPricesLast24Hours(): Promise<IHourlyPrice[]> {
    try {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setHours(now.getHours() - 24);

      return await this.priceRepo
        .createQueryBuilder('price')
        .select([
          "DATE_PART('hour', price.createdAt) as hour",
          'AVG(price.price) as price',
        ])
        .where('price.createdAt BETWEEN :yesterday AND :now', {
          yesterday,
          now,
        })
        .groupBy("DATE_PART('hour', price.createdAt)")
        .orderBy("DATE_PART('hour', price.createdAt)", EOrder.ASC)
        .getRawMany();
    } catch (error) {
      throw error;
    }
  }

  async getSwapRate(ethAmount: number): Promise<ISwapResponse> {
    await this.startMoralis();
    const ethPrice = await this.getEthPrice();
    const btcReceived = ethAmount * BTC_RATE;
    const feeInEth = ethAmount * FEE_PERCENTAGE;
    const feeInDollar = feeInEth * ethPrice;

    return {
      btcReceived,
      fee: {
        eth: feeInEth,
        dollar: feeInDollar,
      },
    };
  }
}
