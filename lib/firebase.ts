import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth, initializeAuth } from 'firebase/auth';
// @ts-expect-error — o exports map do @firebase/auth resolve "types" pro d.ts
// genérico antes de checar a condição "react-native"; a função existe de fato
// no build RN usado em runtime (via Metro), só não é enxergada pelo tsc.
import { getReactNativePersistence } from '@firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);

// No Expo Go/dispositivo físico, "localhost" aponta pro próprio aparelho, não pro
// computador rodando os emuladores — por isso usamos o host do Metro (mesma LAN).
function getEmulatorHost() {
  if (Platform.OS === 'web') return 'localhost';
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  return debuggerHost ?? 'localhost';
}

// Liga/desliga os emuladores locais sem trocar o firebaseConfig acima.
// Defina EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true no .env para usar os emuladores;
// omitido ou "false" conecta direto no projeto real (EXPO_PUBLIC_FIREBASE_PROJECT_ID).
const useEmulator = __DEV__ && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true';

let emulatorsConnected = false;

export function connectToEmulatorsIfNeeded() {
  if (!useEmulator || emulatorsConnected) return;
  emulatorsConnected = true;

  const host = getEmulatorHost();
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
}

connectToEmulatorsIfNeeded();

if (__DEV__) {
  console.log(
    auth.emulatorConfig
      ? `[firebase] Auth emulator ativo em ${auth.emulatorConfig.host}:${auth.emulatorConfig.port}`
      : `[firebase] Auth conectado ao projeto real "${firebaseConfig.projectId}"`
  );
}
