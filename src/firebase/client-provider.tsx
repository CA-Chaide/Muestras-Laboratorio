'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useFirebase } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from './non-blocking-login';
import { Beaker } from 'lucide-react';

function AuthGate({ children }: { children: ReactNode }) {
  const { user, isUserLoading, auth } = useFirebase();

  useEffect(() => {
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
        <Beaker className="w-16 h-16 mb-4 animate-bounce text-primary" />
        <h1 className="text-2xl font-semibold mb-2">LabTrack</h1>
        <p className="text-muted-foreground">Iniciando sesión de forma anónima...</p>
      </div>
    );
  }

  return <>{children}</>;
}


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <AuthGate>{children}</AuthGate>
    </FirebaseProvider>
  );
}
