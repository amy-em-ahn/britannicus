
export const productMapper = {
    toFrontend: (dbProduct) => {
      const product = {
        id: dbProduct.uuid,
        title: dbProduct.title,
        price: dbProduct.price,
        currency: dbProduct.currency || 'USD',
        seller: dbProduct.seller,
        location: dbProduct.location,
        description: dbProduct.description,
        image: dbProduct.imageUrl ? [dbProduct.imageUrl] : [],
        options: dbProduct.salesOptions,
        publishedby: dbProduct.publisher,
        stock: dbProduct.stock || 0,
        condition: dbProduct.condition,
        views: 0, // Not stored in DB
      };
  

      if (dbProduct.Book && dbProduct.Book.length > 0) {
        const book = dbProduct.Book[0];
        return {
          ...product,
          category: book.specCategory || 'rare-books',
          author: book.author,
          genre: book.genre,
          isbn: book.isbn,
          language: book.language,
          format: book.format,

          genres: Array.isArray(book.genre) ? book.genre : [],
          languages: Array.isArray(book.language) ? [book.language] : [],
          formats: book.format ? [book.format] : [],
        };
      } 
      else if (dbProduct.Map && dbProduct.Map.length > 0) {
        const map = dbProduct.Map[0];
        return {
          ...product,
          category: 'maps',
          projection: map.projection,
          size: map.dimensions,
          scale: map.scale,
          detail: map.detail,
          isDiscontinued: map.isDiscontinued,

          sizes: map.dimensions ? [map.dimensions] : [],
          colors: [],
        };
      } 
      else if (dbProduct.Periodical && dbProduct.Periodical.length > 0) {
        const periodical = dbProduct.Periodical[0];
        return {
          ...product,
          category: 'periodicals',
          edition: periodical.edition,
          volume: periodical.volume,
          genre: periodical.genre,
          isbn: periodical.isbn,
          language: periodical.language,

          genres: Array.isArray(periodical.genre) ? periodical.genre : [],
          languages: periodical.language ? [periodical.language] : [],
        };
      }
      
      return product;
    },
  

    toDatabase: (frontendProduct) => {
      const baseProduct = {
        title: frontendProduct.title,
        price: frontendProduct.price,
        currency: frontendProduct.currency || 'USD',
        seller: frontendProduct.seller,
        location: frontendProduct.location,
        description: frontendProduct.description,
        imageUrl: Array.isArray(frontendProduct.image) && frontendProduct.image.length > 0 
          ? frontendProduct.image[0] 
          : frontendProduct.image || null,
        salesOptions: frontendProduct.options,
        publisher: frontendProduct.publishedby,
        stock: frontendProduct.stock || 0,
        condition: frontendProduct.condition,
        uuid: frontendProduct.id || crypto.randomUUID()
      };
  
      let typeData = {};
      const category = frontendProduct.category;
  
      if (category === 'rare-books' || category === 'first-editions') {
        typeData = {
          book: {
            author: frontendProduct.author,
            genre: Array.isArray(frontendProduct.genre) 
              ? frontendProduct.genre 
              : (frontendProduct.genres || []),
            isbn: frontendProduct.isbn,
            language: frontendProduct.language,
            format: frontendProduct.format,
            specCategory: category
          }
        };
      } 
      else if (category === 'maps') {
        typeData = {
          map: {
            projection: frontendProduct.projection,
            dimensions: frontendProduct.size,
            scale: frontendProduct.scale,
            detail: frontendProduct.detail,
            isDiscontinued: frontendProduct.isDiscontinued || false
          }
        };
      } 
      else if (category === 'periodicals') {
        typeData = {
          periodical: {
            edition: frontendProduct.edition,
            volume: frontendProduct.volume,
            genre: Array.isArray(frontendProduct.genre) 
              ? frontendProduct.genre 
              : (frontendProduct.genres || []),
            isbn: frontendProduct.isbn,
            language: frontendProduct.language
          }
        };
      }
  
      return {
        baseProduct,
        typeData,
        category
      };
    }
  };
  