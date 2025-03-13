/*import { Product } from "../models/dto/gen-product.dto";
import { BookDto, SpecCategory } from "../models/dto/book.dto";
import { MapDto } from "../models/dto/map.dto";
import { PeriodicalDto } from "../models/dto/periodical.dto";*/


import { BookDto, MapDto, PeriodicalDto, ProductDto } from "../models/product.dto";

interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    saleOptions?: string;
    genre?: string;
    format?: string;
    projection?: string;
    dimensions?: string;
}

/**
 * Fetches products based on the selected types and filters.
 */
export const getProducts = async (types: string[], filters: ProductFilters): Promise<ProductDto[]> => {
    let query = "";
    let values: any[] = [];

    // Book Query
    if (types.includes("books")) {
        query += `
            SELECT id, title, author, genre, condition, isbn, language, format, price, 
                   publisher AS publishedBy, pubDate, saleOptions, imageUrl, specCategory, 
                   currency, seller, description, location, 'book' AS type
            FROM books 
            WHERE 1=1
        `;

        values = applyFilters(query, values, filters);
    }

    // Map Query
    if (types.includes("maps")) {
        if (query) query += " UNION ";
        query += `
            SELECT id, title, author, price, projection, condition, dimensions, scale, pubDate, 
                   imageUrl, detail AS description, saleOption AS saleOptions, 
                   seller, location, 'map' AS type
            FROM maps 
            WHERE 1=1
        `;

        values = applyFilters(query, values, filters);
    }

    // Periodical Query
    if (types.includes("periodicals")) {
        if (query) query += " UNION ";
        query += `
            SELECT id, title, edition, volume, genre, condition, isbn, language, price, 
                   publisher AS publishedBy, pubDate, saleOptions, imageUrl, 
                   seller, location, description, 'periodical' AS type
            FROM periodicals 
            WHERE 1=1
        `;

        values = applyFilters(query, values, filters);
    }

    query += " ORDER BY price ASC";

    const result = await db.query(query, values);
    return result.rows;
};

/**
 * Adds SQL filter conditions dynamically.
 */
const applyFilters = (query: string, values: any[], filters: ProductFilters): any[] => {
    if (filters.search) {
        query += ` AND title ILIKE $${values.length + 1}`;
        values.push(`%${filters.search}%`);
    }
    if (filters.minPrice) {
        query += ` AND price >= $${values.length + 1}`;
        values.push(filters.minPrice);
    }
    if (filters.maxPrice) {
        query += ` AND price <= $${values.length + 1}`;
        values.push(filters.maxPrice);
    }
    if (filters.condition) {
        query += ` AND condition = $${values.length + 1}`;
        values.push(filters.condition);
    }
    if (filters.saleOptions) {
        query += ` AND saleOptions = $${values.length + 1}`;
        values.push(filters.saleOptions);
    }
    if (filters.genre) {
        query += ` AND genre @> ARRAY[$${values.length + 1}]::text[]`;
        values.push(filters.genre);
    }
    if (filters.format) {
        query += ` AND format = $${values.length + 1}`;
        values.push(filters.format);
    }
    if (filters.projection) {
        query += ` AND projection = $${values.length + 1}`;
        values.push(filters.projection);
    }
    if (filters.dimensions) {
        query += ` AND dimensions = $${values.length + 1}`;
        values.push(filters.dimensions);
    }
    return values;
};


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
