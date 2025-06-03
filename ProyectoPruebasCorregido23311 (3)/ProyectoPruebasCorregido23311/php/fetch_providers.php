<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

$query = "SELECT id, nombre_empresa FROM proveedores WHERE estado = 'activo'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<option value='" . $row['nombre_empresa'] . "'>" . $row['nombre_empresa'] . "</option>";
    }
} else {
    echo "<option value=''>No hay proveedores disponibles</option>";
}

mysqli_close($conn);
