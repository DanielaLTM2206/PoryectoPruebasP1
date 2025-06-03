<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

$cedula = isset($_GET['cedula_cliente']) ? $_GET['cedula_cliente'] : '';

$query = "SELECT id, cedula_cliente, total_pagar, vendedor, fecha_creacion FROM ventas";
if (!empty($cedula)) {
    $cedula = mysqli_real_escape_string($conn, $cedula);
    $query .= " WHERE cedula_cliente = '$cedula'";
}

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $headers = ['ID', 'Cédula', 'Total', 'Vendedor', 'Fecha de Registro', 'Acciones'];
    echo '<table class="user-table"><thead><tr>';
    foreach ($headers as $header) {
        echo '<th>' . htmlspecialchars($header) . '</th>';
    }
    echo '</tr></thead><tbody>';
    while ($row = mysqli_fetch_assoc($result)) {
        echo '<tr>';
        foreach (['id', 'cedula_cliente', 'total_pagar', 'vendedor', 'fecha_creacion'] as $field) {
            echo '<td>' . htmlspecialchars($row[$field]) . '</td>';
        }
        echo '<td><div class="action-buttons">';
        echo '<button class="btn-invoice" data-id="' . htmlspecialchars($row['id']) . '"><i class="fa fa-file"></i> Factura</button>';
        echo '</div></td>';
        echo '</tr>';
    }
    echo '</tbody></table>';
} else {
    echo '<p>No hay datos disponibles.</p>';
}

mysqli_close($conn);
