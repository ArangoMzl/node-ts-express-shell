import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services/product.service";
import { ProductModel } from "../../data";

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`Internal server error: ${error}`);
    res.status(500).send({ error: "Internal server error" });
  }

  createProduct = async (req: Request, res: Response) => {
    try {
      const user = req.body.user;
      if (!user) return res.status(401).json({ error: "Invalid token - User" });

      const productExists = await ProductModel.findOne({
        name: req.body.name,
      });
      if (productExists) throw CustomError.badRequest("Product already exists");

      const [error, productDto] = CreateProductDto.create(req.body);
      if (error) return res.status(400).send({ error });
      const product = this.productService
        .createProduct(productDto!, user)
        .then((product) => {
          res.status(201).json(product);
        })
        .catch((error) => {
          this.handleError(error, res);
        });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit)
    );
    if (error) return res.status(400).send({ error });

    this.productService
      .getProducts(paginationDto!)
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((error) => {
        this.handleError(error, res);
      });
  };
}
