import { initializeApp } from 'firebase/app';
import { v4 as uuid } from 'uuid';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

console.log('Firebase Environment Variables Check:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Not Set',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not Set',
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL ? 'Set' : 'Not Set',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Not Set',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
    ? 'Set'
    : 'Not Set',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
    ? 'Set'
    : 'Not Set',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ? 'Set' : 'Not Set',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    ? 'Set'
    : 'Not Set'
});

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
// Add specific scopes and parameters to fix CORS issues
provider.addScope('profile');
provider.addScope('email');
provider.setCustomParameters({
  prompt: 'select_account'
});
const database = getDatabase(app);

// login with improved error handling
export function login() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      // Success - no need to do anything as onAuthStateChanged will handle it
      return result.user;
    })
    .catch((error) => {
      console.error('Google auth error:', error.code, error.message);
    });
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
export async function addNewProduct(product, imageUrl) {
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    image: imageUrl,
    year: product.year ? parseInt(product.year) : '',
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
