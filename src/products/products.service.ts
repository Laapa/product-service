import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './product.dto';
import { userClient } from './user-client.provider';
import { firstValueFrom } from 'rxjs';
import { timeout, catchError, throwError } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @Inject('USER_SERVICE') private userClient: ClientProxy, 
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    console.log('📨 Отправка запроса на user-service с ID:', dto.ownerId);

    console.log('[ProductService] Sending RPC...');
    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'getUserById' }, dto.ownerId)
      .pipe(
        timeout(2000),
        catchError(() => {
          throw new RpcException({
            statusCode: 404,
            message: 'Пользователь не найден',
          });
        }),
      )
    );
    console.log('[ProductService] Got user:', user);

    if (!user) {
      throw new RpcException(
        {
          statusCode: 404,
          message: 'Пользователь с таким ID не найден',
        }
      );
    }

    const product = new this.productModel(dto);
    return product.save();
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }
}