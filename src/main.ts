import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker')
    .setDescription('API documentation for Blockchain Price Tracker project')
    .setVersion('1.0')
    .addTag('prices')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('prices', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
  const swaggerUrl = `http://localhost:${process.env.APP_PORT}/prices`;
  Logger.log(`Swagger is running on: ${swaggerUrl}`, 'Bootstrap');
}
bootstrap();
