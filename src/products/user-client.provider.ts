import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const userClient = ClientProxyFactory.create({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queue: process.env.USER_QUEUE || 'user_queue',
    queueOptions: { durable: false },
  },
});