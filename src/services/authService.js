import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { db, } from '../firebase/config.js';
import { collection, doc, addDoc, getDoc, getDocs,serverTimestamp, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = "users"

export const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user;
}

export const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
}

export { auth, onAuthStateChanged };

