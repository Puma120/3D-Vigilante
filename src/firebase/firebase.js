import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Las variables se leen del archivo .env (local) o de las variables de entorno de Vercel
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Firestore: base de datos principal
export const db = getFirestore(app);

export default app;
