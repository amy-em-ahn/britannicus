import { BookDto } from "../models/dto/book.dto";
import { MapDto } from "../models/dto/map.dto";
import { PeriodicalDto } from "../models/dto/periodical.dto";

interface BookSearchParams {
    query?: string;
    genre?: string;
    condition?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface MapSearchParams {
    query?: string;
    projection?: string;
    minYear?: number;
    maxYear?: number;
    scale?: string;
}

interface PeriodicalSearchParams {
    query?: string;
    genre?: string;
    volume?: string;
}

export const searchBooks = async (params: BookSearchParams): Promise<BookDto[]> => {
    throw new Error("Not implemented");
};

export const searchMaps = async (params: MapSearchParams): Promise<MapDto[]> => {
    throw new Error("Not implemented");
};

export const searchPeriodicals = async (params: PeriodicalSearchParams): Promise<PeriodicalDto[]> => {
    throw new Error("Not implemented");
};
