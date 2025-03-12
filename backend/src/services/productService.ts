import { Product } from "../models/dto/gen-product.dto";
import { BookDto, SpecCategory } from "../models/dto/book.dto";
import { MapDto } from "../models/dto/map.dto";
import { PeriodicalDto } from "../models/dto/periodical.dto";



export const getAllProducts = async (): Promise<Product[]> => {
    throw new Error("Not implemented");
};

export const getFeaturedProducts = async (): Promise<Product[]> =>{
    throw new Error("Not implemented");
};

export const getAllBooks = async (): Promise<BookDto[]> =>{
    throw new Error("Not implemented");
};

export const getBooksBySpecCategory = async (category: SpecCategory): Promise<BookDto[]> => {
    throw new Error("Not implemented");
};

export const getAllMaps = async (): Promise<MapDto[]> => {
    throw new Error("Not implemented");
};

export const getAllPeriodicals = async (): Promise<PeriodicalDto[]> => {
    throw new Error("Not implemented");
};
