<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

// Consultar servicios activos con su costo y productos asociados
$sql = "SELECT id, nombre, coste_total, productos FROM servicios WHERE estado = 'activo'";
$result = mysqli_query($conn, $sql);

// Generar opciones para el select
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        echo '<option value="' . $row['id'] . '" data-costo="' . $row['coste_total'] . '" data-productos=\'' . $row['productos'] . '\'>' . $row['nombre'] . '</option>';
    }
} else {
    echo '<option value="">No hay servicios disponibles</option>';
}

mysqli_close($conn);
