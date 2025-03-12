import { CreateBookDto, BookDto } from "../models/dto/book.dto";
import { CreateMapDto, MapDto } from "../models/dto/map.dto";
import { CreatePeriodicalDto, PeriodicalDto } from "../models/dto/periodical.dto";

export const addBook = async (bookData: CreateBookDto): Promise<BookDto> => {
    throw new Error("Not implemented");
};

export const updateBook = async (id: number, bookData: Partial<CreateBookDto>): Promise<BookDto> => {
    throw new Error("Not implemented");
};

export const deleteBook = async (id: number): Promise<void> => {
    throw new Error("Not implemented");
};

export const addMap = async (mapData: CreateMapDto): Promise<MapDto> => {
    throw new Error("Not implemented");
};

export const updateMap = async (id: number, mapData: Partial<CreateMapDto>): Promise<MapDto> => {
    throw new Error("Not implemented");
};

export const deleteMap = async (id: number): Promise<void> => {
    throw new Error("Not implemented");
};

export const addPeriodical = async (periodicalData: CreatePeriodicalDto): Promise<PeriodicalDto> => {
    throw new Error("Not implemented");
};

export const updatePeriodical = async (id: number, periodicalData: Partial<CreatePeriodicalDto>): Promise<PeriodicalDto> => {
    throw new Error("Not implemented");
};

export const deletePeriodical = async (id: number): Promise<void> => {
    throw new Error("Not implemented");
};
