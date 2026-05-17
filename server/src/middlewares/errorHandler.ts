import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError || error.name === "ZodError") {
    response.status(400).json({
      message: "Dados invalidos.",
      issues: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof AppError || error.name === "AppError") {
    const statusCode = error instanceof AppError ? error.statusCode : (error as any).statusCode || 400;
    response.status(statusCode).json({
      message: error.message,
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    message: "Erro interno do servidor.",
  });
}

