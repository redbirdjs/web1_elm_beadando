<?php

$host = "sql202.infinityfree.com";
$db = "if0_41439074_web1_beadando";
$username = "if0_41439074";
$password = "9KCw9KAY6b";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    die('Hiba történt az adatbázishoz való csatlakozáskor: ' . $e->getMessage());
}
