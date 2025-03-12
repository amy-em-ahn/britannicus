export type SaleOptions = "auction" | "individual";

export type Format = "hardcover" | "softcover" | "other"

export type Condition = "mint" | "excellent" | "good" | "fair" | "poor"

export type SpecCategory = "first edition" | "rare" | "none"

export interface CreateBookDto {
    title: string,
    author: string,
    genre: string[],
    condition: Condition,
    isbn?: string,
    language: string,
    format: Format
    price: number,
    publisher: string,
    pubDate: Date,
    saleOptions: SaleOptions,
    imageUrl: string,
    specCategory?: SpecCategory
}


export interface BookDto extends CreateBookDto {
    id: number
}