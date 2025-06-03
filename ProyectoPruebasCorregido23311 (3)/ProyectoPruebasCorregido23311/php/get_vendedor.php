<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

$usuario = $_SESSION['usuario'];
$sql_user = "SELECT nombre, apellido FROM perfiles WHERE usuario = ?";
$stmt = $conn->prepare($sql_user);
$stmt->bind_param('s', $usuario);
$stmt->execute();
$result_user = $stmt->get_result();

if ($result_user->num_rows > 0) {
    $user = $result_user->fetch_assoc();
    echo json_encode([
        'success' => true,
        'nombre' => $user['nombre'],
        'apellido' => $user['apellido']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
