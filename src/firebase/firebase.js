import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAp835d26tcsl3efJAgBs3AaAN334LUv38",
  authDomain: "explore-fbaa0.firebaseapp.com",
  projectId: "explore-fbaa0",
  storageBucket: "explore-fbaa0.appspot.com",
  messagingSenderId: "340017342451",
  appId: "1:340017342451:web:63810fe9cf04cbc3535486",
  measurementId: "G-38TE7FM1Z0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
