<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

date_default_timezone_set('America/Guayaquil');
define('DATETIME_FORMAT', 'Y-m-d H:i:s');
define('PASSWORD_FIELD', 'contraseña'); // Constante para el campo contraseña

$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
$usuario_nombre = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : '';

// Función para registrar cambios
function registrarCambio($usuario_nombre, $descripcion, $tipo_cambio, $tabla_afectada, $id_cambiado, $conn) {
    $descripcion = mysqli_real_escape_string($conn, $descripcion);
    $sql = "INSERT INTO cambios (usuario_id, descripcion, tipo_cambio, tabla_afectada, id_cambiado)
            VALUES ('$usuario_nombre', '$descripcion', '$tipo_cambio', '$tabla_afectada', $id_cambiado)";
    mysqli_query($conn, $sql);
}

// Configuración de cada tipo
$tipos = [
    'perfil' => [
        'table' => 'perfiles',
        'fields' => [
            'email' => 'email',
            'genero' => 'genero',
            'fecha_nacimiento' => 'fecha_nacimiento',
            'usuario' => 'usuario',
            'perfil' => 'perfil',
            'permisos' => function($v) { return implode(',', $v); }
        ],
        'password_field' => PASSWORD_FIELD,
        'password_hash' => true,
        'sql_get' => "SELECT nombre, apellido, cedula FROM perfiles WHERE id = %d",
        'desc' => function($row) { return "Perfil actualizado: {$row['nombre']} {$row['apellido']} (Cédula: {$row['cedula']})"; }
    ],
    'cliente' => [
        'table' => 'clientes',
        'fields' => [
            'email' => 'email',
            'genero' => 'genero',
            'fecha_nacimiento' => 'fecha_nacimiento',
            'numero' => 'numero',
            'locacion' => 'locacion'
        ],
        'sql_get' => "SELECT nombre, apellido, cedula FROM clientes WHERE id = %d",
        'desc' => function($row) { return "Cliente actualizado: {$row['nombre']} {$row['apellido']} (Cédula: {$row['cedula']})"; }
    ],
    'proveedor' => [
        'table' => 'proveedores',
        'fields' => [
            'nombre_empresa' => 'nombre_empresa',
            'email_proveedor' => 'email',
            'numero_proveedor' => 'numero',
            'web_proveedor' => 'web'
        ],
        'sql_get' => "SELECT nombre_empresa, web FROM proveedores WHERE id = %d",
        'desc' => function($row) { return "Proveedor actualizado: {$row['nombre_empresa']} (Web: {$row['web']})"; }
    ],
    'producto' => [
        'table' => 'productos',
        'fields' => [
            'nombre_producto' => 'nombre',
            'cantidad_producto' => 'cantidad',
            'precio_producto' => 'precio',
            'precio_compra' => 'precio_compra',
            'marca_producto' => 'marca'
        ],
        'sql_get' => "SELECT nombre, codigo FROM productos WHERE id = %d",
        'desc' => function($row) { return "Producto actualizado: {$row['nombre']} (Codigo: {$row['codigo']})"; }
    ],
    'servicio' => [
        'table' => 'servicios',
        'fields' => [
            'descripcion' => 'descripcion',
            'costo_servicio' => 'costo_servicio',
            'coste_total' => 'coste_total'
        ],
        'sql_get' => "SELECT nombre, descripcion FROM servicios WHERE id = %d",
        'desc' => function($row) { return "Servicio actualizado: {$row['nombre']} (D: {$row['descripcion']})"; }
    ]
];

if (!isset($tipos[$tipo])) {
    echo json_encode(['status' => 'error', 'message' => 'Tipo de operación no válido']);
    mysqli_close($conn);
    exit;
}

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;
$fecha_actualizacion = date(DATETIME_FORMAT);
$conf = $tipos[$tipo];

// Construir SET para SQL
$set = [];
foreach ($conf['fields'] as $postKey => $dbField) {
    $value = isset($_POST[$postKey]) ? $_POST[$postKey] : '';
    if (is_callable($dbField)) {
        $value = $dbField($value);
        $set[] = "permisos = '" . mysqli_real_escape_string($conn, $value) . "'";
    } else {
        $set[] = "$dbField = '" . mysqli_real_escape_string($conn, $value) . "'";
    }
}

// Manejo especial para contraseña en perfil
if ($tipo === 'perfil' && !empty($_POST[PASSWORD_FIELD])) {
    $hashedPassword = password_hash($_POST[PASSWORD_FIELD], PASSWORD_DEFAULT);
    $set[] = PASSWORD_FIELD . " = '$hashedPassword'";
}

$set[] = "fecha_creacion = '$fecha_actualizacion'";
$updateQuery = "UPDATE {$conf['table']} SET " . implode(', ', $set) . " WHERE id = $id";

if (mysqli_query($conn, $updateQuery)) {
    $sql_get = sprintf($conf['sql_get'], $id);
    $result_get = mysqli_query($conn, $sql_get);
    $row = mysqli_fetch_assoc($result_get);
    $descripcion = $conf['desc']($row);

    $msg = [
        'perfil'    => 'Usuario actualizado correctamente',
        'cliente'   => 'Cliente actualizado correctamente',
        'proveedor' => 'Proveedor actualizado correctamente',
        'producto'  => 'Producto actualizado correctamente',
        'servicio'  => 'Servicio actualizado correctamente'
    ];
    registrarCambio($usuario_nombre, $descripcion, 'Actualizar', $conf['table'], $id, $conn);
    echo json_encode(['status' => 'success', 'message' => $msg[$tipo]]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el ' . $conf['table']]);
}

mysqli_close($conn);
