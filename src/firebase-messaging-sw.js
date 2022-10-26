import {initializeApp} from "firebase/app";
import {getMessaging, onBackgroundMessage} from "firebase/messaging/sw";
import {onMessage} from "firebase/messaging";
import {firebaseConfig} from "./config";

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
onMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
});
