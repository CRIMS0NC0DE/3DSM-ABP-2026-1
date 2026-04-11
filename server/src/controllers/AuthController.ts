import type { Request, Response } from "express";

import type { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (request: Request, response: Response): Promise<void> => {
    const result = await this.authService.login(request.body);
    response.status(200).json(result);
  };

  me = async (request: Request, response: Response): Promise<void> => {
    response.status(200).json({
      user: request.authUser,
    });
  };
}

