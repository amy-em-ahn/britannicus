import { Request, Response } from "express";
import * as productService from "../services/productService";


export const getProducts = async (req: Request, res: Response) => {
    try {
        const { type, search, minPrice, maxPrice, condition, saleOptions, genre, format, projection, dimensions, seller, stock, language, category, } = req.query;

        const types = Array.isArray(type) ? (type as string[]) : type ? [type as string] : ["books", "maps", "periodicals"];

        const filters = {
            search: search as string | undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            condition: condition as string | undefined,
            saleOptions: saleOptions as string | undefined,
            genre: genre as string | undefined,
            format: format as string | undefined,
            projection: projection as string | undefined,
            dimensions: dimensions as string | undefined,
            seller: seller as string | undefined,
            stock: stock as number | undefined,
            language: language as string |undefined,
            category: category as string | undefined,
        };

        const products = await productService.getProducts(types, filters);
        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};



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
