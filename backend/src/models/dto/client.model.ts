export interface Client {
    clientId: number,
    name: string,
    //type: clientType // What types are there?
    email: string,
    phone?: string, 
}

export type ClientType = "" | "" // ?

