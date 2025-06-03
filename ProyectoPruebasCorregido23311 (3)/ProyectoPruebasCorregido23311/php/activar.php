<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

if (!$conn) {
    echo json_encode(['status' => 'error', 'message' => 'Error de conexión']);
    exit;
}

date_default_timezone_set('America/Guayaquil');
$fecha_actual = date('Y-m-d H:i:s');

// Función para registrar cambios
function registrarCambio($usuario_nombre, $descripcion, $tipo_cambio, $tabla_afectada, $id_cambiado, $conn) {
    $descripcion = mysqli_real_escape_string($conn, $descripcion);
    $sql = "INSERT INTO cambios (usuario_id, descripcion, tipo_cambio, tabla_afectada, id_cambiado)
            VALUES ('$usuario_nombre', '$descripcion', '$tipo_cambio', '$tabla_afectada', $id_cambiado)";
    mysqli_query($conn, $sql);
}

// Obtener datos POST
$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
$usuario_nombre = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : 'desconocido';

function tablaConfig($tipo, $id, $fecha_actual) {
    $tablas = [
        'perfiles' => [
            'query' => "UPDATE perfiles SET estado = 'activo', fecha_creacion = '$fecha_actual' WHERE id = $id",
            'tabla' => 'perfiles',
            'sql_get' => "SELECT nombre, apellido, cedula FROM perfiles WHERE id = $id",
            'desc' => function($row) { return "Perfil activado: {$row['nombre']} {$row['apellido']} (Cédula: {$row['cedula']})"; }
        ],
        'clientes' => [
            'query' => "UPDATE clientes SET estado = 'activo', fecha_creacion = '$fecha_actual' WHERE id = $id",
            'tabla' => 'clientes',
            'sql_get' => "SELECT nombre, apellido, cedula FROM clientes WHERE id = $id",
            'desc' => function($row) { return "Cliente activado: {$row['nombre']} {$row['apellido']} (Cédula: {$row['cedula']})"; }
        ],
        'proveedores' => [
            'query' => "UPDATE proveedores SET estado = 'activo', fecha_creacion = '$fecha_actual' WHERE id = $id",
            'tabla' => 'proveedores',
            'sql_get' => "SELECT nombre_empresa, web FROM proveedores WHERE id = $id",
            'desc' => function($row) { return "Proveedor activado: {$row['nombre_empresa']} (Web: {$row['web']})"; }
        ],
        'productos' => [
            'query' => "UPDATE productos SET estado = 'activo', fecha_creacion = '$fecha_actual' WHERE id = $id",
            'tabla' => 'productos',
            'sql_get' => "SELECT nombre, codigo FROM productos WHERE id = $id",
            'desc' => function($row) { return "Producto activado: {$row['nombre']} (Código: {$row['codigo']})"; }
        ],
        'servicios' => [
            'query' => "UPDATE servicios SET estado = 'activo', fecha_creacion = '$fecha_actual' WHERE id = $id",
            'tabla' => 'servicios',
            'sql_get' => "SELECT descripcion FROM servicios WHERE id = $id",
            'desc' => function($row) { return "Servicio activado: {$row['descripcion']}"; }
        ]
    ];
    return $tablas[$tipo] ?? null;
}

$info = tablaConfig($tipo, $id, $fecha_actual);

if (!$info) {
    echo json_encode(['status' => 'error', 'message' => 'Tipo no válido']);
    exit;
}

// Ejecutar la consulta de actualización
if (mysqli_query($conn, $info['query'])) {
    $result_get = mysqli_query($conn, $info['sql_get']);
    $row = mysqli_fetch_assoc($result_get);
    $descripcion = $info['desc']($row);

    registrarCambio($usuario_nombre, $descripcion, 'Activo', $info['tabla'], $id, $conn);

    echo json_encode(['status' => 'success', 'message' => 'Registro activado correctamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al activar el registro']);
}

mysqli_close($conn);
