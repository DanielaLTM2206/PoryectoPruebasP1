<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

// Consultar productos activos con su costo
$sql = "SELECT id, nombre, precio FROM productos WHERE estado = 'activo'";
$result = mysqli_query($conn, $sql);

// Generar opciones para el select
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        echo '<option value="' . $row['id'] . '" data-costo="' . $row['precio'] . '">' . $row['nombre'] . '</option>';
    }
} else {
    echo '<option value="">No hay productos disponibles</option>';
}

mysqli_close($conn);
