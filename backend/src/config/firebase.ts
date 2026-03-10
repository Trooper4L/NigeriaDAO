import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

if (!admin.apps.length) {
  const SECRET_FILE = '/etc/secrets/firebase-service-account.json';

  if (existsSync(SECRET_FILE)) {
    const serviceAccount = JSON.parse(readFileSync(SECRET_FILE, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } else {
    let privateKey: string | undefined;
    if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
      privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
    } else if (process.env.FIREBASE_PRIVATE_KEY) {
      privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
    }
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

export const db = admin.firestore();
export default admin;
