import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getMessaging, getToken, onMessage} from "firebase/messaging";

const firebaseConfig = {
    //app config from firebase
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const token = document.querySelector('#token');
const message = document.querySelector('#msg');
const error = document.querySelector('#error');
const notification = document.querySelector('#notification');

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            message.innerHTML = 'Notification permission granted.';
            console.log('Notification permission granted.')
        }
    });
}

const messaging = getMessaging();

getToken(messaging, {vapidKey: 'Application Identity key from firebase'})//replace with your own key
    .then((currentToken) => {
        if (!currentToken) {
            console.log('No registration token available. Request permission to generate one.');
            //
        }
        token.innerHTML = "Token is: " + currentToken;
        console.log(currentToken);
    })
    .catch((err) => {
        error.innerHTML = err.innerHTML + ";" + err;
        console.log('An error occurred while retrieving token. ', err);
    });
onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    notification.innerHTML = JSON.stringify(payload);
});
