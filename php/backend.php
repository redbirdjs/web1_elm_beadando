<?php
require "db.php";

header('Content-Type: application/json');

$method = $_SERVER["REQUEST_METHOD"];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET': getHandler($conn); break;
    case 'POST': postHandler($conn, $input); break;
    case 'PUT': putHandler($conn, $input); break;
    case 'DELETE': deleteHandler($conn); break;
}

function getHandler($conn) {
    try {
        $stmt = $conn->prepare('SELECT * FROM szoftver');
        $stmt->execute();
        $result = $stmt->fetchAll();

        echo json_encode($result);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function postHandler($conn, $input) {
    try {
        $stmt = $conn->prepare('INSERT INTO szoftver (nev, kategoria) VALUES (:nev, :kategoria)');
        $stmt->execute(['nev' => $input['nev'], 'kategoria' => $input['kategoria']]);
        $rowid = $conn->lastInsertId();

        $stmt = $conn->prepare('SELECT * FROM szoftver WHERE id = :id');
        $stmt->execute(['id' => $rowid]);
        $result = $stmt->fetch();

        echo json_encode(['message' => 'Adatsor sikeresen hozzáadva!', 'result' => $result]);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function putHandler($conn, $input) {
    try {
        $stmt = $conn->prepare('UPDATE szoftver SET nev = :nev, kategoria = :kategoria WHERE id = :id');
        $stmt->execute(['id' => $input['id'], 'nev' => $input['nev'], 'kategoria' => $input['kategoria']]);

        echo json_encode(['message' => 'Adatsor sikeresen módosítva!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteHandler($conn) {
    try {
        $stmt = $conn->prepare('DELETE FROM szoftver WHERE id = :id');
        $stmt->execute(['id' => $_GET['id']]);

        echo json_encode(['message' => 'Adatsor sikeresen törölve!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}