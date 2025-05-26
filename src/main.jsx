import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { ClerkProvider } from '@clerk/clerk-react';
const clerkFrontendApi = 'https://adequate-reindeer-65.clerk.accounts.dev'; // from Clerk dashboard
const publishableKey ='pk_test_YWRlcXVhdGUtcmVpbmRlZXItNjUuY2xlcmsuYWNjb3VudHMuZGV2JA'
ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
       
     <ClerkProvider publishableKey={publishableKey} 
      frontendApi={clerkFrontendApi} 
      >
    <App />
  </ClerkProvider>
     
    </BrowserRouter>
  </React.StrictMode>
);