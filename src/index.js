import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { firebase, auth, firestore, Context } from './firebase';

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
