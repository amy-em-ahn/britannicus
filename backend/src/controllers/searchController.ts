import { Request, Response } from "express";
import * as searchService from "../services/searchService";

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { q, genre, condition, min_price, max_price } = req.query;
    const books = await searchService.searchBooks({
      query: q as string,
      genre: genre as string,
      condition: condition as string,
      minPrice: min_price ? Number(min_price) : undefined,
      maxPrice: max_price ? Number(max_price) : undefined,
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Book search failed" });
  }
};

export const searchMaps = async (req: Request, res: Response) => {
  try {
    const { q, projection, year_min, year_max, scale } = req.query;
    const maps = await searchService.searchMaps({
      query: q as string,
      projection: projection as string,
      minYear: year_min ? Number(year_min) : undefined,
      maxYear: year_max ? Number(year_max) : undefined,
      scale: scale as string,
    });

    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: "Map search failed" });
  }
};

export const searchPeriodicals = async (req: Request, res: Response) => {
  try {
    const { q, genre, volume } = req.query;
    const periodicals = await searchService.searchPeriodicals({
      query: q as string,
      genre: genre as string,
      volume: volume as string,
    });

    res.json(periodicals);
  } catch (error) {
    res.status(500).json({ error: "Periodical search"});
    }
};
