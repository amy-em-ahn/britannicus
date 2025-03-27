import { createClient } from "@supabase/supabase-js";

import { productMapper } from "./orm-util";
// Supabase Config
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



export const getProducts = async (category) => {
  try {
    console.log('Fetching products for category:', category)
    
    let query = supabase
      .from('Product')
      .select('*, Book(*), Map(*), Periodical(*)')
    
    switch(category) {
      case 'rare-books':
        query = query
          .not('Book', 'is', null)
          .eq('Book.specCategory', 'rare-books')
        break
        
      case 'first-editions':
        query = query
          .not('Book', 'is', null)
          .eq('Book.specCategory', 'first-editions')
        break
        
      case 'maps':
        query = query
          .not('Map', 'is', null)
        break
        
      case 'periodicals':
        query = query
          .not('Periodical', 'is', null)
        break
        
      default:
        console.warn('No valid category provided, returning all products')
    }

    const { data, error } = await query
    
    if(error) {
      console.error('Supabase query error:', error)
      throw error
    }
    
    console.log(`Found ${data?.length || 0} products for category: ${category}`)
    
    return data.map(product => productMapper.toFrontend(product))

  } catch(error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProductById = async (productUUID) => {
  try {

    const { data: productData, error: productError } = await supabase
      .from('Product')
      .select('*, Book(*), Map(*), Periodical(*)')
      .eq('uuid', productUUID)
      .single()

    if(productError) throw productError
    if(!productData) return null


    return productMapper.toFrontend(productData)

  } catch(error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export const addNewProduct = async (product, imageUrls) => {
  try {
    console.log('Adding new product:', product.title);
    
    // Convert frontend product to database format
    const { baseProduct, typeData, category } = productMapper.toDatabase({
      ...product,
      image: imageUrls,
    });


    const randomId = Math.floor(Math.random() * 128); 

    const productBase = {
      ...baseProduct,
      id: randomId, // Assign the random int8 value as the id
      publishedDate: baseProduct.publishedDate || new Date().toISOString(),
      uuid: crypto.randomUUID(),
    };

    console.log('Final payload to Supabase:', productBase);

    console.log('Inserting base product');

    // Insert main product
    const { data: insertedProduct, error: productError } = await supabase
      .from('Product')
      .insert(productBase)
      .select()
      .single();    

    if (productError) {
      console.error('Error inserting product:', productError);
      throw productError;
    }

    console.log('Product inserted with ID:', insertedProduct.id);

    // Insert type-specific data
    let typeInsert;

    const randomId2 = Math.floor(Math.random() * 128); 
    
    if (category === 'rare-books' || category === 'first-editions') {
      console.log('Inserting book data');
      typeInsert = await supabase
        .from('Book')
        .insert({
          productId: insertedProduct.id,
          id: randomId2,
          ...typeData.book
        });
    } 
    else if (category === 'maps') {
      console.log('Inserting map data');
      typeInsert = await supabase
        .from('Map')
        .insert({
          productId: insertedProduct.id,
          id: randomId2,
          ...typeData.map
        });
    } 
    else if (category === 'periodicals') {
      console.log('Inserting periodical data');
      typeInsert = await supabase
        .from('Periodical')
        .insert({
          productId: insertedProduct.id,
          id: randomId2,
          ...typeData.periodical
        });
    } 
    else {
      throw new Error('Invalid product category: ' + category);
    }

    if (typeInsert.error) {
      console.error('Error inserting type data:', typeInsert.error);
      
      // Rollback product insert if type insert fails
      console.log('Rolling back product insert');
      await supabase
        .from('Product')
        .delete()
        .eq('id', insertedProduct.id);
      
      throw typeInsert.error;
    }
    
    console.log('Product successfully added with ID:', insertedProduct.id);

    // Return the product in frontend format
    return {
      ...productMapper.toFrontend({
        ...insertedProduct,
        [category === 'maps' ? 'Map' : category === 'periodicals' ? 'Periodical' : 'Book']: [
          typeData[category === 'maps' ? 'map' : category === 'periodicals' ? 'periodical' : 'book']
        ]
      }),
      image: imageUrls // Ensure images are returned correctly
    };

  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}


export const getCart = async (userId) => {
  try {
    console.log('Fetching cart for user:', userId);
    
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('Cart')
      .select('id')
      .eq('userId', userId)
      .single();

    if (cartError) {
      console.log('No existing cart found, creating new cart for user:', userId);
      
      // Create a new cart for the user if one doesn't exist
      const { data: newCart, error: createError } = await supabase
        .from('Cart')
        .insert({ userId, uuid: crypto.randomUUID() })
        .select()
        .single();
        
      if (createError) throw createError;
      return []; // Return empty cart since it's newly created
    }

    if (!cart) {
      console.log('No cart found for user', userId);
      return [];
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from('CartItem')
      .select(`
        id,
        quantity,
        productUuid,
        product:productId (
          *,
          Book(*),
          Map(*),
          Periodical(*)
        )
      `)
      .eq('cartId', cart.id);

    if (itemsError) throw itemsError;
    
    console.log(`Found ${items?.length || 0} items in cart`);

    // Map cart items to the format expected by the frontend
    return items.map(item => {
      const productData = productMapper.toFrontend(item.product);
      
      // Add cart-specific fields
      return {
        ...productData,
        quantity: item.quantity,
        cartItemId: item.id, // Store the cart item ID for easier updates/removal
      };
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

export const addOrUpdateToCart = async (userId, product) => {
  try {
    console.log('Adding/updating product in cart:', product.id);
    
    // Get or create cart
    const { data: cart, error: cartError } = await supabase
      .from('Cart')
      .select('id, uuid')
      .eq('userId', userId)
      .single();
    
    let cartId;
    
    if (cartError) {
      // Create new cart if it doesn't exist
      const cartUuid = crypto.randomUUID();
      const { data: newCart, error: createError } = await supabase
        .from('Cart')
        .insert({ userId, uuid: cartUuid })
        .select()
        .single();
        
      if (createError) throw createError;
      cartId = newCart.id;
    } else {
      cartId = cart.id;
    }

    // Get product ID from UUID
    const { data: productData, error: productError } = await supabase
      .from('Product')
      .select('id')
      .eq('uuid', product.id)
      .single();

    if (productError || !productData) {
      throw new Error('Product not found with UUID: ' + product.id);
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('CartItem')
      .select('id, quantity')
      .match({
        cartId: cartId,
        productId: productData.id
      })
      .maybeSingle();
      
    let result;
    
    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = product.quantity || (existingItem.quantity + 1);
      
      const { error: updateError } = await supabase
        .from('CartItem')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);
        
      if (updateError) throw updateError;
      
      result = {
        success: true,
        message: 'Cart item quantity updated',
        quantity: newQuantity
      };
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase
        .from('CartItem')
        .insert({
          cartId: cartId,
          productId: productData.id,
          productUuid: product.id,
          quantity: product.quantity || 1
        });
        
      if (insertError) throw insertError;
      
      result = {
        success: true,
        message: 'Product added to cart',
        quantity: product.quantity || 1
      };
    }

    return result;

  } catch (error) {
    console.error('Error updating cart:', error);
    return { success: false, message: error.message };
  }
};

export const removeFromCart = async (userId, productUUID) => {
  try {
    console.log('Removing product from cart:', productUUID);
    
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('Cart')
      .select('id')
      .eq('userId', userId)
      .single();

    if (cartError || !cart) {
      return { success: false, message: 'Cart not found' };
    }

    // Option 1: Remove by productUuid directly
    const { error: deleteError } = await supabase
      .from('CartItem')
      .delete()
      .match({
        cartId: cart.id,
        productUuid: productUUID
      });

    if (deleteError) {
      // Option 2: If that fails, try to get the product ID first
      const { data: productData } = await supabase
        .from('Product')
        .select('id')
        .eq('uuid', productUUID)
        .single();
        
      if (productData) {
        const { error: secondDeleteError } = await supabase
          .from('CartItem')
          .delete()
          .match({
            cartId: cart.id,
            productId: productData.id
          });
          
        if (secondDeleteError) throw secondDeleteError;
      } else {
        throw deleteError;
      }
    }

    return { success: true, message: 'Removed from cart' };

  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: error.message };
  }
};

export const updateCartItemQuantity = async (userId, productUUID, quantity) => {
  try {
    console.log(`Updating cart item quantity: ${productUUID} to ${quantity}`);
    
    if (quantity <= 0) {
      // If quantity is zero or negative, remove the item
      return removeFromCart(userId, productUUID);
    }
    
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('Cart')
      .select('id')
      .eq('userId', userId)
      .single();

    if (cartError || !cart) {
      return { success: false, message: 'Cart not found' };
    }

    // Update the cart item quantity
    const { error: updateError } = await supabase
      .from('CartItem')
      .update({ quantity })
      .match({
        cartId: cart.id,
        productUuid: productUUID
      });

    if (updateError) {
      // If updating by UUID fails, try with product ID
      const { data: productData } = await supabase
        .from('Product')
        .select('id')
        .eq('uuid', productUUID)
        .single();
        
      if (productData) {
        const { error: secondUpdateError } = await supabase
          .from('CartItem')
          .update({ quantity })
          .match({
            cartId: cart.id,
            productId: productData.id
          });
          
        if (secondUpdateError) throw secondUpdateError;
      } else {
        throw updateError;
      }
    }

    return { 
      success: true, 
      message: 'Quantity updated',
      quantity: quantity
    };

  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return { success: false, message: error.message };
  }
};

export const getCategoryInfo = async () => {
  try {
    // Try to fetch from categories table if exists
    const { data, error } = await supabase
      .from('categories')
      .select('*')

    if (!error && data.length > 0) {
      return data.reduce((acc, row) => ({
        ...acc,
        [row.slug]: row
      }), {})
    }
  } catch (e) {
    // Fall through to default data
  }

  // Default category data
  return {
    'rare-books': {
      title: 'Rare Books',
      description: 'Our rare books collection features valuable and unique titles...'
    },
    maps: {
      title: 'Vintage Maps',
      description: 'Explore our collection of antique and vintage maps...'
    },
    periodicals: {
      title: 'Periodicals',
      description: 'Discover our selection of historical magazines...'
    },
    'first-editions': {
      title: 'First Editions',
      description: 'Our first editions collection features original printings...'
    }
  }
}


export const sanityCheck = async () => {
  console.log('Sanity check started')
  try {
    // 1. Verify environment variables
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables')
    }

    // 2. Test basic query
    const { data: testData, error: testError } = await supabase
      .rpc('test_connection')
      .single()

    // 3. Verify product table exists with sample data
    const { data: productData, error: productError } = await supabase
      .from('Product')
      .select('*')


    // 4. Verify cart table structure
    const { data: cartData, error: cartError } = await supabase
      .from('Cart')
      .select('id')
      .limit(1)

    console.log('Sanity check completed')

    return {
      success: true,
      stats: {
        connection: testData === 'OK' ? 'Connected' : 'Failed',
        product_table: productError ? 'Error' : 'Exists',
        cart_table: cartError ? 'Error' : 'Exists',
        sample_products: productData?.length || 0
      }
    }
  } catch (error) {
    console.error('Sanity check failed:', error)
    return {
      success: false,
      error: error.message,
      details: {
        supabase_url: SUPABASE_URL ? 'Set' : 'Missing',
        supabase_key: SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      }
    }
  }
}