import {
  Product,
  ProductCreationAttributes,
  ProductAttributes,
} from '../models/product.model';
import { Photo } from '../models/photo.model';
import { Favorite } from '../models/favorite.model';

export class ProductService {
  public async get(productId: string) {
    return Product.findOne({
      where: {
        id: productId,
      },
      include: Photo as any,
    });
  }

  public async create(product: ProductCreationAttributes, userId: number) {
    product.UserId = userId;
    delete product.status;
    return Product.create(product);
  }

  public async update(productId: string, productChanges: ProductAttributes) {
    delete productChanges.id;
    delete productChanges.UserId;
    productChanges.status = 'pending';
    delete productChanges.title;
    delete productChanges.productType;

    return Product.update(productChanges, {
      where: {
        id: productId,
      },
    });
  }

  public async approve(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
    product.status = 'approved';
    return product.save();
  }

  public async reject(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
    product.status = 'rejected';
    return product.save();
  }

  public async enable(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
    product.availability = true;
    return product.save();
  }

  public async disable(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
    product.availability = false;
    return product.save();
  }

  public async return(productId: string): Promise<Product> {
    const product = await Product.findByPk(productId);
    product.status = 'returned';
    return product.save();
  }

  public async delete(productId: string) {
    const product = await Product.findByPk(productId);
    if (['approved', 'pending'].includes(product.status)) {
      return product.destroy();
    } else {
      throw new Error('Referenced Product is not an active product');
    }
  }

  public async getAll() {
    return Product.findAll({
      where: {
        status: 'approved',
        availability: true,
      },
      include: Photo as any,
    });
  }

  public async getAllWithFavorite(userId: number) {
    return Product.findAll({
      where: {
        status: 'approved',
      },
      include: [
        {
          model: Favorite as any,
          where: {
            UserId: userId,
          },
          required: false
        },
        {
          model: Photo as any,
        },
      ],
    });
  }

  public async getMyProducts(userId: number) {
    return Product.findAll({
      where: {
        UserId: userId,
      },
      include: Photo as any,
    });
  }

  public async getToBeApproved() {
    return Product.findAll({
      where: {
        status: 'pending',
      },
      include: Photo as any,
    });
  }
}
