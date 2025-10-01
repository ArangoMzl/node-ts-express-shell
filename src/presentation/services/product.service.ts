import { ProductModel } from "../../data";
import {
  CreateProductDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class ProductService {
  constructor() {}

  async createProduct(productDto: CreateProductDto, user: UserEntity) {
    const productExists = await ProductModel.findOne({
      name: productDto.name,
    });
    if (productExists) throw CustomError.badRequest("Product already exists");
    try {
      const product = new ProductModel({
        ...productDto,
        user: user.id,
      });
      await product.save();
      return { product };
    } catch (error) {
      throw CustomError.internalServer(`Error creating product: ${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((paginationDto.page - 1) * paginationDto.limit)
          .limit(paginationDto.limit)
          .populate("user", "name email")
          .populate("category", "name"),
      ]);

      return {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        next: `/api/products?page=${paginationDto.page + 1}&limit=${
          paginationDto.limit
        }`,
        prev:
          paginationDto.page > 1
            ? `/api/products?page=${paginationDto.page - 1}&limit=${
                paginationDto.limit
              }`
            : null,
        products: products.map((product) => product),
      };
    } catch (error) {
      throw CustomError.internalServer(`Error load products: ${error}`);
    }
  }
}
