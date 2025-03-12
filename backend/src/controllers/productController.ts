import { Request, Response } from "express";
import * as productService from "../services/productService";


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getFeatured = async (req: Request, res: Response) => {
    try {
        const products = await productService.getFeaturedProducts();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
}

export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAllBooks();
        res.json(products);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
}


export const getFirstEditions = async (req: Request, res: Response) => {
  try {
    const books = await productService.getBooksBySpecCategory("first edition");
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch first editions" });
  }
};

export const getRareBooks = async (req: Request, res: Response) => {
  try {
    const books = await productService.getBooksBySpecCategory("rare");
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rare books" });
  }
};

export const getMaps = async (req: Request, res: Response) => {
  try {
    const maps = await productService.getAllMaps();
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch maps" });
  }
};

export const getPeriodicals = async (req: Request, res: Response) => {
  try {
    const periodicals = await productService.getAllPeriodicals();
    res.json(periodicals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch periodicals" });
  }
};
