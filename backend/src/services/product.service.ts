import {
  Product,
  ProductCreationAttributes,
  ProductAttributes,
} from '../models/product.model';

export class ProductService {
  public async get(productId: string) {
    return Product.findOne({
      where: {
        id: productId,
      },
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
      },
    });
  }

  public async getMyProducts(userId: number) {
    return Product.findAll({
      where: {
        UserId: userId,
      },
    });
  }

  public async getToBeApproved() {
    return Product.findAll({
      where: {
        status: 'pending',
      },
    });
  }
}