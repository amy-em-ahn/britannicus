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

  // Handle both single image URL (string) and multiple image URLs (array)
  const images = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const primaryImage = images.length > 0 ? images[0] : '';

  return set(ref(database, `products/${id}`), {
    ...cleanProduct,
    id,
    price: parseInt(cleanProduct.price) || 0,
    image: primaryImage, // Keep the single image field for backward compatibility
    images: images, // Add the array of images
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
  return get(ref(database, `carts/${userId}`)) //
    .then((snapshot) => {
      const items = snapshot.val() || {};
      console.log('cart items:', items);

      return Object.values(items);
    });
}

export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.Id}`), product);
}

export async function removeFromCart(userId, productId) {
  return remove(ref(database, `carts/${userId}/${productId}`));
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
