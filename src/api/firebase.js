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

// Import Supabase functions
import {
  addNewProduct as supabaseAddNewProduct,
  getProducts as supabaseGetProducts,
  getProductById as supabaseGetProductById,
  getCart as supabaseGetCart,
  addOrUpdateToCart as supabaseAddOrUpdateToCart,
  removeFromCart as supabaseRemoveFromCart,
  getCategoryInfo as supabaseGetCategoryInfo
} from './subabase';

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
  // Convert Firebase format to Supabase format
  const images = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const supabaseProduct = {
    ...product,
    imageUrl: images[0],
    images: images
  };
  
  return supabaseAddNewProduct(supabaseProduct, images[0]);
}

// get products
export async function getProducts(category) {
  return supabaseGetProducts(category);
}

export async function getProductById(productId) {
  return supabaseGetProductById(productId);
}

// Cart
export async function getCart(userId) {
  return supabaseGetCart(userId);
}

export async function addOrUpdateToCart(userId, product) {
  return supabaseAddOrUpdateToCart(userId, product);
}

export async function removeFromCart(userId, productId) {
  return supabaseRemoveFromCart(userId, productId);
}

// Category
export async function getCategoryInfo() {
  return supabaseGetCategoryInfo();
}
