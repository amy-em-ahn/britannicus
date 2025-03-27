import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

// Supabase Config
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export const getProducts = async (category) => {
  try {
    
    let query = supabase
      .from('Product')
      .select('*, Book(*), Map(*), Periodical(*)')

    switch(category) {
      case 'rare-books':
        query = query.eq('Book.specCategory', 'rare-books')
        break
      case 'first-editions':
        query = query.eq('Book.specCategory', 'first-editions')
        break
      case 'maps':
        query = query.not('Map.id', 'is', null)
        break
      case 'periodicals':
        query = query.not('Periodical.id', 'is', null)
        break
      default:
        throw new Error('Invalid category')
    }

    const { data, error } = await query
    
    if(error) throw error
    
    // Merge nested relationships and ensure imageUrl is an array
    return data.map(product => ({
      ...product,
      ...product.book?.[0],
      ...product.map?.[0],
      ...product.periodical?.[0],
      image: product.imageUrl ? [product.imageUrl] : []
    }))

  } catch(error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const getProductById = async (productUUID) => {
  try {
    // Get base product
    const { data: productData, error: productError } = await supabase
      .from('Product')
      .select('*, Book(*), Map(*), Periodical(*)')
      .eq('uuid', productUUID)
      .single()

    if(productError) throw productError
    if(!productData) return null

    // Determine type and get full details
    let typeData = {}
    if(productData.book?.length) {
      typeData = productData.book[0]
    } else if(productData.map?.length) {
      typeData = productData.map[0]
    } else if(productData.periodical?.length) {
      typeData = productData.periodical[0]
    }

    return {
      ...productData,
      ...typeData,
      image: productData.imageUrl ? [productData.imageUrl] : []
    }

  } catch(error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export const addNewProduct = async (product, imageUrls) => {
  const productBase = {
    title: product.title,
    price: product.price,
    currency: product.currency || 'USD',
    seller: product.seller,
    location: product.location,
    description: product.description,
    imageUrl: imageUrls[0] || null,
    salesOptions: product.salesOptions,
    publishedDate: new Date().toISOString(),
    publisher: product.publisher,
    stock: product.stock || 0,
    condition: product.condition,
    uuid: product.uuid || crypto.randomUUID()
  }

  try {
    // Insert main product
    const { data: insertedProduct, error: productError } = await supabase
      .from('product')
      .insert(productBase)
      .select()
      .single()

    if(productError) throw productError

    // Insert type-specific data
    let typeInsert
    switch(product.category) {
      case 'rare-books':
      case 'first-editions':
        typeInsert = await supabase
          .from('book')
          .insert({
            productId: insertedProduct.id,
            author: product.author,
            genre: product.genre,
            isbn: product.isbn,
            language: product.language,
            format: product.format,
            specCategory: product.category
          })
        break

      case 'maps':
        typeInsert = await supabase
          .from('map')
          .insert({
            productId: insertedProduct.id,
            projection: product.projection,
            dimensions: product.dimensions,
            scale: product.scale,
            detail: product.detail,
            isDiscontinued: product.isDiscontinued
          })
        break

      case 'periodicals':
        typeInsert = await supabase
          .from('periodical')
          .insert({
            productId: insertedProduct.id,
            edition: product.edition,
            volume: product.volume,
            genre: product.genre,
            isbn: product.isbn,
            language: product.language
          })
        break

      default:
        throw new Error('Invalid product category')
    }

    if(typeInsert.error) {
      // Rollback product insert if type insert fails
      await supabase
        .from('product')
        .delete()
        .eq('id', insertedProduct.id)
      
      throw typeInsert.error
    }

    return {
      ...insertedProduct,
      ...product,
      images: imageUrls
    }

  } catch(error) {
    console.error('Error adding product:', error)
    throw error
  }
}

// Add cart functions
export const getCart = async (userId) => {
  try {
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select('id')
      .eq('userId', userId)
      .single()

    if (cartError || !cart) {
      console.log('No cart found for user', userId)
      return []
    }

    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from('cart_item')
      .select(`
        quantity,
        product:productId (
          *,
          book(*),
          map(*),
          periodical(*)
        )
      `)
      .eq('cartId', cart.id)

    if (itemsError) throw itemsError

    // Merge product data with quantity
    return items.map(item => ({
      ...item.product,
      ...item.product?.book?.[0],
      ...item.product?.map?.[0],
      ...item.product?.periodical?.[0],
      quantity: item.quantity
    }))

  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export const addOrUpdateToCart = async (userId, product) => {
  try {
    // Get or create cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .upsert({ userId }, { onConflict: 'userId' })
      .select()
      .single()

    if (cartError) throw cartError

    // Get product ID from UUID
    const { data: productData, error: productError } = await supabase
      .from('product')
      .select('id')
      .eq('uuid', product.id)
      .single()

    if (productError || !productData) {
      throw new Error('Product not found')
    }

    // Upsert cart item
    const { error: itemError } = await supabase
      .from('cart_item')
      .upsert(
        {
          cartId: cart.id,
          productId: productData.id,
          productUuid: product.id,
          quantity: product.quantity || 1
        },
        { onConflict: 'cartId,productId' }
      )

    if (itemError) throw itemError

    return {
      success: true,
      message: product.quantity ? 'Quantity updated' : 'Added to cart'
    }

  } catch (error) {
    console.error('Error updating cart:', error)
    return { success: false, message: error.message }
  }
}

export const removeFromCart = async (userId, productUUID) => {
  try {
    // Get user's cart
    const { data: cart, error: cartError } = await supabase
      .from('cart')
      .select('id')
      .eq('userId', userId)
      .single()

    if (cartError || !cart) {
      return { success: false, message: 'Cart not found' }
    }

    // Get product ID from UUID
    const { data: productData, error: productError } = await supabase
      .from('product')
      .select('id')
      .eq('uuid', productUUID)
      .single()

    if (productError || !productData) {
      return { success: false, message: 'Product not found' }
    }

    // Delete cart item
    const { error: deleteError } = await supabase
      .from('cart_item')
      .delete()
      .match({
        cartId: cart.id,
        productId: productData.id
      })

    if (deleteError) throw deleteError

    return { success: true, message: 'Removed from cart' }

  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, message: error.message }
  }
}

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