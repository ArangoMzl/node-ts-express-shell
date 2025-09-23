import { Request, Response } from "express";
import { CustomError, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(`Internal server error: ${error}`);
    res.status(500).send({ error: "Internal server error" });
  }

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).send({ error });

    this.authService
      .registerUser(registerDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).send({ error });

    this.authService
      .loginUser(loginDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const token = req.params.token;
    this.authService
      .validateEmail(token)
      .then(() => res.send({ message: "Email validated" }))
      .catch((error) => this.handleError(error, res));
  };
}
