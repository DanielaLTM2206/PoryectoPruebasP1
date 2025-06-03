<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

if (isset($_POST['id'])) {
    $producto_id = intval($_POST['id']); // Asegurarse de que el ID es un entero

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("SELECT cantidad FROM productos WHERE id = ?");
    $stmt->bind_param('i', $producto_id);
    $stmt->execute();
    $stmt->bind_result($cantidad);
    $stmt->fetch();
    $stmt->close();

    // Devolver la cantidad
    echo $cantidad !== null ? $cantidad : '0';
} else {
    echo '0';
}

mysqli_close($conn);
