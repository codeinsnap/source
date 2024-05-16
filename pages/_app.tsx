import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { store, persistor } from "../store/store";
import { Provider } from "react-redux";
import Layout from '@/components/Layout/Layout';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { PersistGate } from 'redux-persist/integration/react'
import { msalConfig } from '@/components/Auth/auth';
import { applyConfig, environment } from '@/config/env';
import { useEffect, useState } from 'react';

//Add layout page and main entry page for next js

//store.subscribe(()=>console.log('IIIIIII', store.getState()))//to check inital state

let authInstance = new PublicClientApplication(msalConfig);

export default function App({ Component, pageProps }: AppProps) {
  const [apploaded, setApploaded] = useState(false);

  useEffect(() => {
    applyConfig();
    msalConfig.auth.clientId = environment.NEXT_PUBLIC_REACT_APP_MS_AD_CLIENT_ID;
    msalConfig.auth.authority = environment.NEXT_PUBLIC_REACT_APP_MS_AD_AUTH_URL;
    msalConfig.auth.redirectUri = environment.NEXT_PUBLIC_REACT_APP_DASHBOARD_URL;
    authInstance = new PublicClientApplication(msalConfig);
    setApploaded(true);
  }, []);
  return (
    apploaded ? <>
      <MsalProvider instance={authInstance}>
        {/* <AuthProvider> */}
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
            </PersistGate>
          </Provider>
          <Toaster />
        {/* </AuthProvider> */}
      </MsalProvider>
    </> : <></>
  )
}
