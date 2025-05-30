import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@products/product.schema';
import { ProductsService } from '@products/products.service';
import { ProductsController } from '@products/products.controller';
import { userClient } from '@products/user-client.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  providers: [
    ProductsService,
    {
      provide: 'USER_SERVICE',
      useValue: userClient,
    },
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}