<?php
session_start();

// Verificar si se debe comprobar la sesión
if (!defined('NO_SESSION_CHECK') && !isset($_SESSION['usuario'])) {
    echo json_encode(['status' => 'error', 'message' => 'No estás autorizado']);
    exit;
}

$conn = mysqli_connect('localhost', 'root', 'root', 'spa_base');// NOSONAR: La contraseña está codificada intencionalmente para este entorno de desarrollo controlado.

if (!$conn) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión']);
    exit;
}
