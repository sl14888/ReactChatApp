import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyDfouAJg7Wk6yBL5T_AxmkbC8fCMsAh3Kg',
  authDomain: 'chatapp-kubsu.firebaseapp.com',
  projectId: 'chatapp-kubsu',
  storageBucket: 'chatapp-kubsu.appspot.com',
  messagingSenderId: '541118397361',
  appId: '1:541118397361:web:205de4873857447c85db90',
  measurementId: 'G-XJ0YJTK80K',
});

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        firebase,
        auth,
        firestore,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
