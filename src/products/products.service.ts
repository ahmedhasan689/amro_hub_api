import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResource } from './resources/product.resource';
import { ProductQueryDto } from './dto/product-query.dto';
import { deleteFile } from '../common/multer/file-helper';

@Injectable()
class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Find All Functionality
   * @param query
   */
  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      category,
    } = query;
    const skip = (page - 1) * limit;

    const qb = this.productRepository.createQueryBuilder('product');

    // Filter by search
    if (search) {
      qb.andWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    // Filter by price range
    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    // Pagination
    const [products, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data: ProductResource.collection(products),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create Functionality
   * @param createProductDto
   * @param coverImage
   */
  async create(createProductDto: CreateProductDto, coverImage: string) {
    const product = this.productRepository.create({
      ...createProductDto,
      coverImage,
    });

    const saved = await this.productRepository.save(product);

    return new ProductResource(saved);
  }

  /**
   * Find Specific Product Functionality
   * @param id
   */
  async findOne(id: string): Promise<ProductResource> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product_NOT_FOUND');
    }

    return new ProductResource(product);
  }

  /**
   * Update Functionality
   * @param id
   * @param updateProductDto
   * @param coverImage
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    coverImage?: string,
  ) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product_NOT_FOUND');
    }

    if (coverImage) {
      deleteFile('products', product.coverImage);
    }

    const updated = await this.productRepository.save({
      ...product!,
      ...updateProductDto,
      ...(coverImage && { coverImage }),
    });

    return new ProductResource(updated);
  }

  /**
   * Delete Functionality
   * @param id
   */
  async delete(id: string): Promise<void> {
    const result = await this.productRepository.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException('Product_NOT_FOUND');
    }
  }

  /**
   * Change Status Functionality
   * @param id
   */
  async changeStatus(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product_NOT_FOUND');
    }

    product.isActive = !product.isActive;

    const updated = await this.productRepository.save(product);

    return new ProductResource(updated);
  }
}

export default ProductsService;
