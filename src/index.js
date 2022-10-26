import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {deleteToken, getMessaging, getToken, onMessage} from "firebase/messaging";
import {firebaseConfig} from "./config";
import {vapidKey} from "./config";

require('./main.css');

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';
const removeTokenButton = document.querySelector('.removeToken');
const requestPermissionButton = document.querySelector('.requestPermission');

const messaging = getMessaging();

onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // Update the UI to include the received message.
    appendMessage(payload);
});

function resetUI() {
    clearMessages();
    showToken('loading...');
    getToken(messaging, {vapidKey: vapidKey})
        .then((currentToken) => {
            if (currentToken) {
                sendTokenToServer(currentToken);
                updateUIForPushEnabled(currentToken);
            } else {
                // Show permission request.
                console.log('No registration token available. Request permission to generate one.');
                // Show permission UI.
                updateUIForPushPermissionRequired();
                setTokenSentToServer(false);
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            showToken('Error retrieving registration token. ', err);
            setTokenSentToServer(false);
        });
}

function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector('.token');
    tokenElement.textContent = currentToken;
}

// Send the registration token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        const url = 'saveToken.php';
        let xhr = new XMLHttpRequest()

        xhr.open('POST', url, true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.send(currentToken)

        xhr.onload = function () {
            if (xhr.status === 201) {
                console.log("Token saved successfully");
                setTokenSentToServer(true);
            } else {
                console.log("Error saving token");
            }
        }
    } else {
        console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
    }
}

removeTokenButton.addEventListener('click', removeToken);
requestPermissionButton.addEventListener('click', requestPermission);

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') === '1';
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? '1' : '0');
}

function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
        div.style = 'display: visible';
    } else {
        div.style = 'display: none';
    }
}

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            resetUI();
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
}

function removeToken() {
    // Delete registration token.
    getToken(messaging).then((currentToken) => {
        deleteToken(messaging).then(() => {
            console.log('Token deleted.');
            setTokenSentToServer(false);
            // Once token is deleted update UI.
            resetUI();
        }).catch((err) => {
            console.log('Unable to delete token. ', err);
        });
    }).catch((err) => {
        console.log('Error retrieving registration token. ', err);
        showToken('Error retrieving registration token. ', err);
    });
}

// Add a message to the messages' element.
function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderElement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style.overflowX = 'hidden';
    dataHeaderElement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
}

// Clear the messages' element of all children.
function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
    }
}

function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
}

function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
}

resetUI();