// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/* ===========================================================
   RISING STAR SCHOOL (NEW DATABASE)
   Project ID = one-click-online
=========================================================== */

const risingConfig = {
  apiKey: "AIzaSyBXFegVGIYVk02zY6Ks3DhcoWjomNw_ht0",
  authDomain: "one-click-online.firebaseapp.com",
  projectId: "one-click-online",
  storageBucket: "one-click-online.firebasestorage.app",
  messagingSenderId: "988928725446",
  appId: "1:988928725446:web:81f45c1187bc048343a2c7",
};

const risingApp = initializeApp(risingConfig);

/* ===========================================================
   GALLAD TECH STORAGE
=========================================================== */

const galladConfig = {
  apiKey: "AIzaSyCXOp6MPnwArV0NiPPAmkBBKdvQoc0gadk",
  authDomain: "rawaan-online-shop.firebaseapp.com",
  projectId: "rawaan-online-shop",
  storageBucket: "rawaan-online-shop.firebasestorage.app",
  messagingSenderId: "492970437433",
  appId: "1:492970437433:web:17249ff78baca4e86b56e8",
};

const galladApp = initializeApp(galladConfig, "gallad");

/* ===========================================================
   EXPORTS
=========================================================== */

export const db = getFirestore(risingApp);
export const auth = getAuth(risingApp);

export const storage = getStorage(galladApp);

export default risingApp;