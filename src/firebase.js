import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { createContext } from 'react';

firebase.initializeApp({
  apiKey: 'AIzaSyDfouAJg7Wk6yBL5T_AxmkbC8fCMsAh3Kg',
  authDomain: 'chatapp-kubsu.firebaseapp.com',
  projectId: 'chatapp-kubsu',
  storageBucket: 'chatapp-kubsu.appspot.com',
  messagingSenderId: '541118397361',
  appId: '1:541118397361:web:205de4873857447c85db90',
  measurementId: 'G-XJ0YJTK80K',
});

const Context = createContext(null);
const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, Context, firestore, firebase };
