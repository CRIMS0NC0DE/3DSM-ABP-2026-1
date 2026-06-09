import type { Request, Response } from "express";

import type { DocumentService } from "../services/DocumentService";

export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const result = await this.documentService.list(request.authUser!, request.query);
    response.status(200).json({ documents: result.data, pagination: result.pagination });
  };

  get = async (request: Request, response: Response): Promise<void> => {
    const document = await this.documentService.get(request.authUser!, String(request.params.id ?? ""));
    response.status(200).json({ document });
  };

  createLink = async (request: Request, response: Response): Promise<void> => {
    const document = await this.documentService.createLink(request.authUser!, request.body);
    response.status(201).json({ document });
  };

  createFile = async (request: Request, response: Response): Promise<void> => {
    const document = await this.documentService.createFile(request.authUser!, request.body, request.file);
    response.status(201).json({ document });
  };

  download = async (request: Request, response: Response): Promise<void> => {
    const document = await this.documentService.get(request.authUser!, String(request.params.id ?? ""));
    const filePath = this.documentService.getFilePath(document);
    response.download(filePath, document.originalFileName ?? document.title);
  };

  raw = async (request: Request, response: Response): Promise<void> => {
    const document = await this.documentService.get(request.authUser!, String(request.params.id ?? ""));
    const filePath = this.documentService.getFilePath(document);
    if (document.contentType) response.type(document.contentType);
    response.sendFile(filePath);
  };

  delete = async (request: Request, response: Response): Promise<void> => {
    await this.documentService.delete(request.authUser!, String(request.params.id ?? ""));
    response.status(204).send();
  };
}
