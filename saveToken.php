<?php
session_start();

$token = file_get_contents('php://input');
$redis = new Redis();
$redis->connect('redis');
$redis->auth('redis');


if ($redis->set('connection' . session_id(), $token)){
    http_response_code(201);
    echo 'Token saved';
} else {
    http_response_code(500);
    echo 'Token not saved';
}
$redis->close();
