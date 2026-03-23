<?php
require "db.php";

header('Content-Type: application/json');

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET': getHandler($conn); break;
    case 'POST': postHandler($conn, $input); break;
    case 'PUT': putHandler($conn, $input); break;
    case 'delete': deleteHandler($conn, $input); break;
}

function getHandler($conn) {

}

function postHandler($conn, $input) {

}

function putHandler($conn, $input) {

}

function deleteHandler($conn, $input) {

}