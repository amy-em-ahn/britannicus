import { Request, Response } from "express";
import * as adminService from "../services/adminService";

export const addBook = async (req: Request, res: Response) => {
  try {
    const newBook = await adminService.addBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to add book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const updatedBook = await adminService.updateBook(Number(req.params.id), req.body);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    await adminService.deleteBook(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
};

export const addMap = async (req: Request, res: Response) => {
  try {
    const newMap = await adminService.addMap(req.body);
    res.status(201).json(newMap);
  } catch (error) {
    res.status(500).json({ error: "Failed to add map" });
  }
};

export const updateMap = async (req: Request, res: Response) => {
  try {
    const updatedMap = await adminService.updateMap(Number(req.params.id), req.body);
    res.json(updatedMap);
  } catch (error) {
    res.status(500).json({ error: "Failed to update map" });
  }
};

export const deleteMap = async (req: Request, res: Response) => {
  try {
    await adminService.deleteMap(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete map" });
  }
};
