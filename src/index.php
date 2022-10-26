<?php
require 'config.php';

function send_notification(array $message): bool|string
{
    $redis = new Redis();
    $redis->connect('redis');
    $redis->auth('redis');

    $keys = $redis->keys('connection*');
    $tokens = array_map(fn ($key) => $redis->get($key), $keys);

    $headers = array(
        'Authorization: key = ' . API_KEY,
        'Content-Type: application/json'
    );

    $notification = [
        'title' => $message['title'] ?? 'Title',
        'body' => $message['body'] ?? 'Body',

    ];

    if (empty($tokens)){
        return 'No registration_ids in redis';
    }

    $fcmNotification = [
        //to => single device id
        'registration_ids' => $tokens,
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
        return 'Curl failed: ' . curl_error($ch);
    }
    curl_close($ch);

    $obj = json_decode($result);

    $reg_ids_result = array_combine($keys, $obj->results);
    foreach ($reg_ids_result as $id => $res) {
        if (isset($res->error)) {
            if ($res->error === 'NotRegistered') {
                $redis->del($id);
            }
        }
    }
    $redis->close();

    return $result;
}

$message_status = send_notification(MESSAGE);
echo $message_status . PHP_EOL;