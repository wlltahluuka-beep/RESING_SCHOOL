import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "API_KEY_GAAGA",
  authDomain: "resing-school-erp.firebaseapp.com",
  projectId: "resing-school-erp",
  storageBucket: "resing-school-erp.firebasestorage.app",
  messagingSenderId: "165001325650",
  appId: "1:165001325650:web:9190a1fea4e3459418438b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;