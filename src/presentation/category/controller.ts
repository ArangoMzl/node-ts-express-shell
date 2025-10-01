import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`Internal server error: ${error}`);
    res.status(500).send({ error: "Internal server error" });
  }

  createCategory = (req: Request, res: Response) => {
    try {
      const user = req.body.user.id;
      if (!user) return res.status(401).json({ error: "Invalid token - User" });

      const [error, categoryDto] = CreateCategoryDto.create(req.body);
      if (error) return res.status(400).send({ error });
      const category = this.categoryService
        .createCategory(categoryDto!, user)
        .then((category) => {
          res.status(201).json(category);
        })
        .catch((error) => {
          this.handleError(error, res);
        });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit)
    );
    if (error) return res.status(400).send({ error });
    this.categoryService
      .getCategories(paginationDto!)
      .then((categories) => {
        res.status(200).json(categories);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
