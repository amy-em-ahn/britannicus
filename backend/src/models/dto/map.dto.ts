import { Condition, SaleOptions } from "./book.dto"

type Projection = "stereographic" | "lambert" | "mercator" | "robinson" | "transverse mercator" | "other"

export interface CreateMapDto {
    title: string,
    author?: string,
    price: number,
    projection?: Projection,
    condition?: Condition,
    dimensions?: string,
    scale?: string,
    pubDate?: Date,
    imageUrl?: string,
    detail?: string, // description
    saleOption?: SaleOptions
    isDiscontinuted?: boolean
    seller?: string,
    location?: string,
    description?: string,
}

export interface MapDto extends CreateMapDto {
    id: number
    quantity?: number
}