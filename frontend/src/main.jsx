import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store.js';
import router from './routes/index.jsx';
import './index.css';

// --- PATCH GLOBAL FETCH AVEC TOKEN ---
const originalFetch = window.fetch;

window.fetch = (input, init = {}) => {
  const token = localStorage.getItem("token"); // récupère le JWT

  // ajoute automatiquement les headers
  init.headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };

  // tu peux garder credentials si tu en as besoin
  init.credentials = "include";

  return originalFetch(input, init);
};


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      />
    </PersistGate>
  </Provider>
);
