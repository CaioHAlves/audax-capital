import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProduct } from '../../application/create-product';
import { ListProducts } from '../../application/list-products';
import { GetProduct } from '../../application/get-product';
import { UpdateProduct } from '../../application/update-product';
import { DeleteProduct } from '../../application/delete-product';
import {
  CreateProductDto,
  ListProductsQueryDto,
  UpdateProductDto,
} from './product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProduct,
    private readonly listProducts: ListProducts,
    private readonly getProduct: GetProduct,
    private readonly updateProduct: UpdateProduct,
    private readonly deleteProduct: DeleteProduct,
  ) {}

  @Post()
  create(@Body() body: CreateProductDto) {
    return this.createProduct.execute(body);
  }

  @Get()
  list(@Query() query: ListProductsQueryDto) {
    return this.listProducts.execute(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.getProduct.execute(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.updateProduct.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.deleteProduct.execute(id);
  }
}
