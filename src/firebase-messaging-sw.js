import {initializeApp} from "firebase/app";
import {getMessaging, onBackgroundMessage} from "firebase/messaging/sw";
import {onMessage} from "firebase/messaging";

const firebaseApp = initializeApp({
    //app config from firebase
});
const messaging = getMessaging(firebaseApp);
onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
});
onMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received foreground message ', payload);
});
