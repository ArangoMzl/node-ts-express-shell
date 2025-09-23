import { CategoryModel } from "../../data";
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  constructor() {}

  async createCategory(categoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({
      name: categoryDto.name,
    });
    if (categoryExists) throw CustomError.badRequest("Category already exists");
    try {
      const category = new CategoryModel({
        ...categoryDto,
        user: user.id,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`Error creating category: ${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((paginationDto.page - 1) * paginationDto.limit)
          .limit(paginationDto.limit),
      ]);

      return {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        next: `/api/categories?page=${paginationDto.page + 1}&limit=${paginationDto.limit}`,
        prev: paginationDto.page > 1 ? `/api/categories?page=${paginationDto.page - 1}&limit=${paginationDto.limit}` : null,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        })),
      };
    } catch (error) {
      throw CustomError.internalServer(`Error load categories: ${error}`);
    }
  }
}
