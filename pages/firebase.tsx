// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore, collection, getDocs, updateDoc } from 'firebase/firestore/lite';
import { doc, setDoc, addDoc } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

// Get all posts
export async function getPosts(db: any) {
  const postsCol = collection(db, 'posts');
  const postSnapshot = await getDocs(postsCol);
  const postList = postSnapshot.docs.map((doc: { data: () => any; }) => doc.data());
  return postList;
}

export async function createPost(db: any, company: string, msg: string, pubkey: string, signature: string) {
    const docRef = await addDoc(collection(db, "posts"), {
        company: company, 
        msg: msg, 
        pubkey: pubkey, 
        signature: signature
      });
      console.log("Document written with ID: ", docRef.id);

} 
