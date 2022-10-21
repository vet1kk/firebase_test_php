<?php
const URL = 'https://fcm.googleapis.com/fcm/send';
const API_KEY = 'YOUR_API_KEY';//replace with your own key
const REGISTRATION_TOKEN = 'YOUR_APP_REGISTRATION_TOKEN';//replace with your own token

function send_notification()
{
    $headers = array(
        'Authorization: key = ' . API_KEY,
        'Content-Type: application/json'
    );

    $notification = [
        'title' => 'Hello',
        'body' => 'I am a notification',

    ];

    $fcmNotification = [
        'to' => REGISTRATION_TOKEN,
        'notification' => $notification,
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, URL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fcmNotification));

    $result = curl_exec($ch);

    if ($result === FALSE) {
        die('Curl failed: ' . curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

$message_status = send_notification();
echo $message_status;

