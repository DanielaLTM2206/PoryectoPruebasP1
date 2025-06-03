<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

// Consulta para obtener los datos de los cambios
$query = "SELECT id, id_cambiado, descripcion, tipo_cambio, fecha, tabla_afectada FROM cambios ORDER BY fecha DESC";
$headers = ['ID', 'ID de Cambio', 'Descripción', 'Tipo de Cambio', 'Fecha', 'Tabla Afectada'];

$result = mysqli_query($conn, $query);

// Verificar si hubo un error en la consulta
if (!$result) {
    die("Error en la consulta: " . mysqli_error($conn));
}

// Verificar el número de filas en el resultado
if (mysqli_num_rows($result) > 0) {
    echo '<table class="user-table"><thead><tr>';

    // Imprimir los encabezados de la tabla
    foreach ($headers as $header) {
        echo '<th>' . htmlspecialchars($header) . '</th>';
    }
    echo '</tr></thead><tbody>';

    while ($row = mysqli_fetch_assoc($result)) {
        echo '<tr>';
        foreach (['id', 'id_cambiado', 'descripcion', 'tipo_cambio', 'fecha', 'tabla_afectada'] as $field) {
            echo '<td>' . htmlspecialchars($row[$field]) . '</td>';
        }
        echo '</tr>';
    }
    echo '</tbody></table>';
} else {
    echo '<p>No hay datos disponibles.</p>';
}

mysqli_close($conn);
