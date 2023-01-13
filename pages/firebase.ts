// Import the functions you need from the SDKs you need
import localforage from 'localforage'
import firebase from 'firebase/app'
import 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT
}

console.log(firebaseConfig)

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  console.log('init')
  firebase.initializeApp(firebaseConfig)
} else {
  console.log('already init')
  firebase.app() // if already initialized, use that one
}

const db = firebase.firestore()

// Get all posts
export async function getPosts() {
  db.collection('posts')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log(`${doc.id} => ${doc.data()}`)
      })
    })
}

export async function createPost(
  id: string,
  company: string,
  msg: string,
  pubkey: string
) {
  console.log('🚀 ~ id', id)
  db.collection('posts')
    .doc(id)
    .set({
      company: company,
      msg: msg,
      pubkey: pubkey
      // signature: signature
    })
    .then(docRef => {
      console.log('Document written with ID: ', docRef)
    })
    .catch(error => {
      console.error('Error adding document: ', error)
    })
}
