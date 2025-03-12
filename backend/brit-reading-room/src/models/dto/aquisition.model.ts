export interface Aquisition {
    aquId: number,
    itemId: number,
    clientId: number,
    dateAquired: Date,
    itemType?: ItemType,
    pricePaid?: number,
}

type ItemType = "map" | "book" | "periodical"