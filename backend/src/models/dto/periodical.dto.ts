import { Condition, SaleOptions } from "./book.dto"

export interface CreatePeriodicalDto {
    title: string,
    edition?: string,
    volume?: string,
    genre: string[],
    condition: Condition,
    isbn?: string,
    language?: string,
    price: number,
    publisher?: string,
    pubDate?: Date,
    saleOptions: SaleOptions,
    imageUrl: string,
    currency?: string,
    seller?: string,
    location?: string,
    description?: string
}

export interface PeriodicalDto extends CreatePeriodicalDto{
    id: number
}
