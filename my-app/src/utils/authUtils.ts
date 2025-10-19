import { signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export async function handleSignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function handleSignUp(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, 'users', user.uid), {
    name: email.split('@')[0],
    isKid: true,
    balance: 0,
    createdImages: [],
    ownedImages: [],
    fridge: {},
    receivedImages: [],
    createdAt: Date.now()
  });
}

export async function handleLogin(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}