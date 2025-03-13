export type SaleOptions = "auction" | "individual";
export type Format = "hardcover" | "softcover" | "other";
export type Condition = "mint" | "excellent" | "good" | "fair" | "poor";
export type SpecCategory = "first edition" | "rare" | "none";
export type Projection = "stereographic" | "lambert" | "mercator" | "robinson" | "transverse mercator" | "other";


export interface BaseProductDto {
    id: string | number;
    title: string;
    price: number;
    currency?: string;
    seller?: string;
    location?: string;
    description?: string;
    imageUrl: string;
    saleOptions: SaleOptions;
    publishedBy?: string; 
    pubDate?: Date | string;
    createdAt?: Date | string;
    stock?: number | string; 
}

export interface BookDto extends BaseProductDto {
    author: string;
    genre: string[];
    condition: Condition;
    isbn?: string;
    language?: string;
    format: Format;
    specCategory?: SpecCategory;
}

export interface MapDto extends BaseProductDto {
    author?: string;
    projection?: Projection;
    condition?: Condition;
    dimensions?: string;
    scale?: string;
    detail?: string;
    isDiscontinued?: boolean;
    quantity?: number;
}

export interface PeriodicalDto extends BaseProductDto {
    edition?: string;
    volume?: string;
    genre: string[];
    condition: Condition;
    isbn?: string;
    language?: string;
    quantity?: number;
}


export type ProductDto = BookDto | MapDto | PeriodicalDto;
