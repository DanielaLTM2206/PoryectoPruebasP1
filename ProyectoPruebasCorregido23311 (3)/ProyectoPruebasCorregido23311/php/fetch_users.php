<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

// Definir constante para el atributo data-tipo
define('DATA_TIPO_ATTR', '" data-tipo="');

$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'perfiles';  // 'perfiles' es el valor por defecto

// Configuración de cada tipo
$tipos = [
    'perfiles' => [
        'query' => "SELECT id, nombre, apellido, email, genero, fecha_nacimiento, cedula, usuario, perfil, estado FROM perfiles ORDER BY id DESC",
        'headers' => ['ID', 'Nombres', 'Apellidos', 'Email', 'Género', 'Fecha de Nacimiento', 'Cédula', 'Usuario', 'Perfil', 'Estado', 'Acciones'],
        'fields' => ['id', 'nombre', 'apellido', 'email', 'genero', 'fecha_nacimiento', 'cedula', 'usuario', 'perfil', 'estado']
    ],
    'clientes' => [
        'query' => "SELECT id, nombre, apellido, email, genero, fecha_nacimiento, cedula, numero, locacion, estado FROM clientes ORDER BY id DESC",
        'headers' => ['ID', 'Nombres', 'Apellidos', 'Email', 'Género', 'Fecha de Nacimiento', 'Cédula', 'Número', 'Locación', 'Estado', 'Acciones'],
        'fields' => ['id', 'nombre', 'apellido', 'email', 'genero', 'fecha_nacimiento', 'cedula', 'numero', 'locacion', 'estado']
    ],
    'proveedores' => [
        'query' => "SELECT id, nombre_empresa, email, numero, web, estado FROM proveedores ORDER BY id DESC",
        'headers' => ['ID', 'Nombre de la Empresa', 'Email', 'Número', 'Web', 'Estado', 'Acciones'],
        'fields' => ['id', 'nombre_empresa', 'email', 'numero', 'web', 'estado']
    ],
    'productos' => [
        'query' => "SELECT id, nombre, cantidad, proveedor, precio, precio_compra, marca, codigo, estado FROM productos ORDER BY id DESC",
        'headers' => ['ID', 'Nombre', 'Cantidad', 'Proveedor', 'Precio de Venta', 'Precio de Compra', 'Marca', 'Código Producto', 'Estado', 'Acciones'],
        'fields' => ['id', 'nombre', 'cantidad', 'proveedor', 'precio', 'precio_compra', 'marca', 'codigo', 'estado']
    ],
    'servicios' => [
        'query' => "SELECT id, nombre, descripcion, costo_servicio, coste_total, estado FROM servicios ORDER BY id DESC",
        'headers' => ['ID', 'Nombre', 'Descripción', 'Costo Servicio', 'Total', 'Estado', 'Acciones'],
        'fields' => ['id', 'nombre', 'descripcion', 'costo_servicio', 'coste_total', 'estado']
    ],
    'ventas' => [
        'query' => "SELECT id, cedula_cliente, total_pagar, vendedor, fecha_creacion, estado FROM ventas ORDER BY id DESC",
        'headers' => ['ID', 'Cédula Cliente', 'Total a Pagar', 'Vendedor', 'Fecha de Creación', 'Estado', 'Acciones'],
        'fields' => ['id', 'cedula_cliente', 'total_pagar', 'vendedor', 'fecha_creacion', 'estado']
    ]
];

if (!isset($tipos[$tipo])) {
    echo json_encode(['status' => 'error', 'message' => 'Tipo no válido']);
    exit;
}

$conf = $tipos[$tipo];
$result = mysqli_query($conn, $conf['query']);

if (mysqli_num_rows($result) > 0) {
    echo '<table class="user-table">';
    echo '<thead><tr>';
    foreach ($conf['headers'] as $header) {
        echo '<th>' . htmlspecialchars($header) . '</th>';
    }
    echo '</tr></thead>';
    echo '<tbody>';

    while ($row = mysqli_fetch_assoc($result)) {
        echo '<tr>';
        foreach ($conf['fields'] as $field) {
            echo '<td>' . htmlspecialchars($row[$field]) . '</td>';
        }

        // Botones de acciones
        echo '<td><div class="action-buttons">';
        if ($tipo == 'productos') {
            echo '<button class="btn-add-product" data-id="' . htmlspecialchars($row['id']) . '"><i class="fa fa-plus"></i> Añadir</button>';
        }
        if ($tipo == 'ventas') {
            echo '<button class="btn-invoice" data-id="' . htmlspecialchars($row['id']) . '"><i class="fa fa-file"></i> Factura</button>';
        } else {
            if (isset($row['estado']) && $row['estado'] == 'inactivo') {
                echo '<button class="btn-activate" data-id="' . htmlspecialchars($row['id']) . DATA_TIPO_ATTR . htmlspecialchars($tipo) . '"><i class="fa fa-check"></i> Activar</button>';
            } else {
                echo '<button class="btn-deactivate" data-id="' . htmlspecialchars($row['id']) . DATA_TIPO_ATTR . htmlspecialchars($tipo) . '"><i class="fa fa-ban"></i> Desactivar</button>';
            }
            echo '<button class="btn-edit" data-id="' . htmlspecialchars($row['id']) . DATA_TIPO_ATTR . htmlspecialchars($tipo) . '"><i class="fa fa-pencil-alt"></i> Editar</button>';
        }
        echo '</div></td>';
        echo '</tr>';
    }

    echo '</tbody>';
    echo '</table>';
} else {
    echo '<p>No hay datos disponibles.</p>';
}

mysqli_close($conn);
