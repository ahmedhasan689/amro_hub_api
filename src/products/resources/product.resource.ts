import { Product } from '../product.entity';

export class ProductResource {
  id: string;
  name: string;
  coverImage: string | null;
  description: string;
  stock: number;
  wholesalePrice: number;
  price: number;
  category: string;
  status: boolean;
  createdAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.coverImage = product.coverImageUrl;
    //this.stock = product.stock;
    //this.wholesalePrice = product.wholesalePrice;
    this.price = product.price;
    this.category = product.category;
    this.status = product.isActive;
    //this.createdAt = product.createdAt;
  }

  static collection(products: Product[]): ProductResource[] {
    return products.map((product) => new ProductResource(product));
  }
}
