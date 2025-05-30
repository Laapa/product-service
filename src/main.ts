import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'product_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
  console.log('🚀 Product Service is running via RabbitMQ');
}
bootstrap();