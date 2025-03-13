export interface ProductFilters {
    search?: string,
    condition?: string,
    saleOption?: string,
    stock?: string,
    category?: string,
}

const applyFilters = (query: string, values: any[], filters: ProductFilters)=>{


    if(filters.search){
        query += ` AND (title ILIKE $${values.length + 1}`;
        values.push(`%${filters.search}%`);
    }
    if(filters.condition){
        query += ` AND condition = $${values.length + 1}`;
        values.push(filters.condition);
    }
    if(filters.saleOption){
        query += ` AND saleOption = $${values.length + 1}`;
        values.push(filters.condition);
    }
    if(filters.stock){
        query += ` AND quantity > $${values.length + 1}`;
        values.push(filters.condition);
    }
    if(filters.category){
        query += ` AND bookCategory = $${values.length + 1}`;
        values.push(filters.condition);
    }
    return values
}

export const getQuery = (types: string[], filters: ProductFilters) =>{
    let query = "";
    let values: any[] = [];
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
    return query;
}

