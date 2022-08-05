import admin from "firebase-admin";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fileKey = fs.readFileSync(path.join(__dirname, './keyfbs.json'), 'utf-8');
const serviceAccount = JSON.parse(fileKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const db = admin.firestore();
export const Chats = db.collection('chats');
export const Products = db.collection('products');