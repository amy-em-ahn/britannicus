import { initializeApp } from 'firebase/app';
import { v4 as uuid } from 'uuid';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Google Auth Provider
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// login
export function login() {
  signInWithPopup(auth, provider).catch(console.error);
}

// logout
export function logout() {
  signOut(auth).catch(console.error);
}

// user state
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    // 1. user login
    const updatedUser = user ? await adminUser(user) : null;
    console.log('user:', user);
    callback(updatedUser);
  });
}

async function adminUser(user) {
  // 2. check admin or not
  return get(ref(database, 'admin')) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admin = snapshot.val();
        console.log('admin:', admin);

        // 3. {...user, isAdmin: true/false}
        const isAdmin = admin.includes(user.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}

// add new products
export async function addNewProduct(product, imageUrls) {
  const id = uuid();

  // Clean up the product object to remove undefined values
  const cleanProduct = Object.entries(product).reduce((acc, [key, value]) => {
    // Skip undefined values
    if (value === undefined) return acc;

    // Handle arrays - ensure they're valid arrays
    if (Array.isArray(value)) {
      acc[key] = value.filter(
        (item) => item !== undefined && item !== null && item !== ''
      );
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});

  // Handle both single image URL and multiple image URLs
  const images = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const primaryImage = images.length > 0 ? images[0] : '';

  return set(ref(database, `products/${id}`), {
    ...cleanProduct,
    id,
    price: parseInt(cleanProduct.price) || 0,
    image: primaryImage,
    images: images,
    year: cleanProduct.year ? parseInt(cleanProduct.year) : '',
    createdAt: new Date().toISOString()
  });
}

// get products
export async function getProducts(category) {
  console.log('Fetching products with category:', category);
  try {
    const snapshot = await get(ref(database, 'products'));
    console.log(
      'Database response:',
      snapshot.exists() ? 'Data exists' : 'No data'
    );

    if (snapshot.exists()) {
      const products = Object.values(snapshot.val());
      console.log('Total products found:', products.length);

      if (category) {
        const filtered = products.filter(
          (product) => product.category === category
        );
        console.log(
          'Filtered products for category',
          category,
          ':',
          filtered.length
        );
        return filtered;
      }

      return products;
    }
    console.log('No products found in database');
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    const snapshot = await get(ref(database, `products/${productId}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No product found with ID:', productId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

// Cart
export async function getCart(userId) {
  console.log('Getting cart for user:', userId);
  if (!userId) {
    console.log('No user ID provided for getCart');
    return [];
  }

  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      console.log('Cart items from Firebase:', items);
      console.log('Cart items as array:', Object.values(items));

      return Object.values(items);
    })
    .catch((error) => {
      console.error('Error getting cart:', error);
      return [];
    });
}

export async function addOrUpdateToCart(userId, product) {
  console.log('Adding/updating cart item:', product);

  if (!userId || !product || !product.id) {
    console.error('Invalid parameters for addOrUpdateToCart:', {
      userId,
      product
    });
    throw new Error('Invalid parameters: userId and product.id are required');
  }

  const itemRef = ref(database, `carts/${userId}/${product.id}`);
  const beforeSnapshot = await get(itemRef);
  const beforeData = beforeSnapshot.exists() ? beforeSnapshot.val() : null;

  // undefined 값 제거
  const cleanProduct = Object.entries(product).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  if (!cleanProduct.id && product.id) {
    cleanProduct.id = product.id;
  }

  await set(itemRef, cleanProduct);

  const afterSnapshot = await get(itemRef);
  const afterData = afterSnapshot.exists() ? afterSnapshot.val() : null;

  let changed = false;
  let action = 'updated';

  if (!beforeData && afterData) {
    changed = true;
    action = 'added';
  } else if (beforeData && afterData) {
    changed = beforeData.quantity !== afterData.quantity;
  }

  console.log(`Cart item ${changed ? action : 'not changed'}`);

  return {
    success: true,
    changed,
    action,
    message: changed ? `Item ${action} successfully` : 'No changes were made'
  };
}

export async function removeFromCart(userId, productId) {
  console.log(`Removing product ${productId} from cart for user ${userId}`);

  const itemRef = ref(database, `carts/${userId}/${productId}`);
  const snapshot = await get(itemRef);

  if (!snapshot.exists()) {
    console.log(`Item ${productId} does not exist in cart`);
    return { success: false, message: 'Item not found in cart' };
  }

  await remove(itemRef);

  const checkSnapshot = await get(itemRef);
  const success = !checkSnapshot.exists();

  console.log(`Item removal ${success ? 'successful' : 'failed'}`);
  return {
    success,
    message: success ? 'Item removed successfully' : 'Failed to remove item'
  };
}

// Category
export async function getCategoryInfo() {
  try {
    const snapshot = await get(ref(database, 'categories'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {
      'rare-books': {
        title: 'Rare Books',
        description:
          'Our rare books collection features valuable and unique titles from various periods, including signed copies, limited editions, and historically significant works.'
      },
      maps: {
        title: 'Vintage Maps',
        description:
          'Explore our collection of antique and vintage maps, including historical cartography, decorative maps, and geographic rarities from around the world.'
      },
      periodicals: {
        title: 'Periodicals',
        description:
          'Discover our selection of historical magazines, journals, and newspapers, offering insight into past eras through contemporary reporting and commentary.'
      },
      'first-editions': {
        title: 'First Editions',
        description:
          'Our first editions collection features original printings of important literary works, providing collectors with pristine examples of publishing history.'
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      'rare-books': {
        title: 'Rare Books',
        description:
          'Our rare books collection features valuable and unique titles from various periods.'
      },
      maps: {
        title: 'Vintage Maps',
        description:
          'Explore our collection of antique and vintage maps from around the world.'
      },
      periodicals: {
        title: 'Periodicals',
        description:
          'Discover our selection of historical magazines, journals, and newspapers.'
      },
      'first-editions': {
        title: 'First Editions',
        description:
          'Our first editions collection features original printings of important literary works.'
      }
    };
  }
}
