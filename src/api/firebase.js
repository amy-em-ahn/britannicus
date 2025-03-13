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
  return get(ref(database, 'products')).then((snapshot) => {
    if (snapshot.exists()) {
      const products = Object.values(snapshot.val());

      if (category) {
        return products.filter((product) => product.category === category);
      }

      return products;
    }
    return [];
  });
}
