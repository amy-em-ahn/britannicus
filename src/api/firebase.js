import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  onAuthStateChanged,
  getRedirectResult
} from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Google Auth Provider
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

// login - use redirect approach primarily
export function login() {
  signInWithRedirect(auth, provider).catch((error) => {
    console.error('Redirect authentication error:', error);
  });
}

// Handle redirect result
export function handleRedirectResult() {
  return getRedirectResult(auth)
    .then((result) => {
      if (result) {
        // User successfully signed in
        return result.user;
      }
      return null;
    })
    .catch((error) => {
      console.error('Authentication redirect result error:', error);
      return null;
    });
}

// Fallback to popup if needed (optional)
export function loginWithPopup() {
  signInWithPopup(auth, provider).catch((error) => {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn(
        'Popup closed before completing sign-in. Switching to redirect...'
      );
      signInWithRedirect(auth, provider);
    } else {
      console.error('Authentication error:', error);
    }
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
  return get(ref(database, 'admin')).then((snapshot) => {
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

export { app, auth };
