import type { Request, Response } from "express";

import { AppError } from "../errors/AppError";
import type { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (request: Request, response: Response): Promise<void> => {
    const result = await this.authService.login(request.body);
    response.status(200).json(result);
  };

  register = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser;
    if (!actor) {
      response.status(401).json({ message: "Usuario nao autenticado." });
      return;
    }

    const user = await this.authService.createUser(actor, request.body);
    response.status(201).json({ user });
  };

  listUsers = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser;
    if (!actor) {
      response.status(401).json({ message: "Usuario nao autenticado." });
      return;
    }

    const users = await this.authService.listUsers(actor);
    response.status(200).json({ users });
  };

  updateUser = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser;
    if (!actor) {
      response.status(401).json({ message: "Usuario nao autenticado." });
      return;
    }

    const userId = String(request.params.id ?? "");
    if (!userId) {
      throw new AppError("Usuario nao informado.", 400);
    }

    const user = await this.authService.updateUser(actor, userId, request.body);
    response.status(200).json({ user });
  };

  deleteUser = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser;
    if (!actor) {
      response.status(401).json({ message: "Usuario nao autenticado." });
      return;
    }

    const userId = String(request.params.id ?? "");
    if (!userId) {
      throw new AppError("Usuario nao informado.", 400);
    }

    await this.authService.deleteUser(actor, userId);
    response.status(204).send();
  };

  updateMe = async (request: Request, response: Response): Promise<void> => {
    const actor = request.authUser;
    if (!actor) {
      response.status(401).json({ message: "Usuario nao autenticado." });
      return;
    }

    const user = await this.authService.updateOwnCredentials(actor.id, request.body);
    response.status(200).json({ user });
  };

  me = async (request: Request, response: Response): Promise<void> => {
    response.status(200).json({
      user: request.authUser,
    });
  };
}

