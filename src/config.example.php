<?php
//create config.php file in the same directory with the following content:


const URL = 'https://fcm.googleapis.com/fcm/send';

//change this to your own API key
const API_KEY = 'your server key from database';

//you can change the message of notification here
const MESSAGE = [
    'title' => 'Notification title',
    'body' => 'Notification body',
];