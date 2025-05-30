import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from '@products/products.service';
import { CreateProductDto } from '@products/product.dto';
import { Product } from '@products/product.schema';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'createProduct' })
  async createProduct(data: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(data);
  }

  @MessagePattern({ cmd: 'getProductById' })
  async getProductById(id: string): Promise<Product | null> {
    return this.productsService.getProductById(id);
  }
}