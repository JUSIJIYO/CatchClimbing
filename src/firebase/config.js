import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // db 객체 얻기 위한 함수

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // <- vite에서 제공하는 객체 / VITE가 붙어 있는 객체를 import 시켜줌
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // 파이어베이스 초기화

// firestore 라이브러리 사용을 위한 객체가져오기
export const db = getFirestore(app);
export const auth = getAuth(app);
