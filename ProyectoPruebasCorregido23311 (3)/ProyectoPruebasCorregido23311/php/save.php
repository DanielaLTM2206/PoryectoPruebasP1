<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

// Obtener el tipo de operación
$tipo = isset($_POST['tipo']) ? $_POST['tipo'] : '';
$usuario_nombre = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : '';

function registrarCambio($usuario_nombre, $descripcion, $tipo_cambio, $tabla_afectada, $conn) {
    $descripcion = mysqli_real_escape_string($conn, $descripcion);
    $sql = "INSERT INTO cambios (usuario_id, descripcion, tipo_cambio, tabla_afectada)
            VALUES ('$usuario_nombre', '$descripcion', '$tipo_cambio', '$tabla_afectada')";
    mysqli_query($conn, $sql);
}

switch ($tipo) {
    case 'perfil':
        // Obtener datos del perfil
        $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
        $apellido = mysqli_real_escape_string($conn, $_POST['apellido']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $genero = mysqli_real_escape_string($conn, $_POST['genero']);
        $fecha_nacimiento = mysqli_real_escape_string($conn, $_POST['fecha_nacimiento']);
        $cedula = mysqli_real_escape_string($conn, $_POST['cedula']);
        $usuario = mysqli_real_escape_string($conn, $_POST['usuario']);
        $password = mysqli_real_escape_string($conn, $_POST['contraseña']);
        $perfil = mysqli_real_escape_string($conn, $_POST['perfil']);
        $permisos = isset($_POST['permisos']) ? implode(',', $_POST['permisos']) : '';

        // Encriptar la contraseña
        $password = password_hash($password, PASSWORD_BCRYPT);

        // Verificar si el perfil ya existe
        $sql_check = "SELECT * FROM perfiles WHERE cedula='$cedula'";
        $result_check = mysqli_query($conn, $sql_check);

        if (mysqli_num_rows($result_check) > 0) {
            echo json_encode(['status' => 'error', 'message' => 'La cédula ya está registrada']);
        } else {
            // Insertar nuevo perfil
            $sql = "INSERT INTO perfiles (nombre, apellido, email, genero, fecha_nacimiento, cedula, usuario, contraseña, perfil, permisos)
                    VALUES ('$nombre', '$apellido', '$email', '$genero', '$fecha_nacimiento', '$cedula', '$usuario', '$password', '$perfil', '$permisos')";
            if (mysqli_query($conn, $sql)) {
                registrarCambio($usuario_nombre, "Perfil agregado: $nombre $apellido", 'Agregar', 'perfiles', $conn);
                echo json_encode(['status' => 'success', 'message' => 'Perfil guardado con éxito']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al guardar el perfil: ' . mysqli_error($conn)]);
            }
        }
        break;

    case 'cliente':
        // Obtener datos del cliente
        $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
        $apellido = mysqli_real_escape_string($conn, $_POST['apellido']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $genero = mysqli_real_escape_string($conn, $_POST['genero']);
        $fecha_nacimiento = mysqli_real_escape_string($conn, $_POST['fecha_nacimiento']);
        $cedula = mysqli_real_escape_string($conn, $_POST['cedula']);
        $numero = mysqli_real_escape_string($conn, $_POST['numero']);
        $locacion = mysqli_real_escape_string($conn, $_POST['locacion']);

        // Verificar si el cliente ya existe
        $sql_check = "SELECT * FROM clientes WHERE cedula='$cedula'";
        $result_check = mysqli_query($conn, $sql_check);

        if (mysqli_num_rows($result_check) > 0) {
            echo json_encode(['status' => 'error', 'message' => 'La cédula ya está registrada']);
        } else {
            // Insertar nuevo cliente
            $sql = "INSERT INTO clientes (nombre, apellido, email, genero, fecha_nacimiento, cedula, numero ,locacion)
                    VALUES ('$nombre', '$apellido', '$email', '$genero', '$fecha_nacimiento', '$cedula', '$numero' , '$locacion')";
            if (mysqli_query($conn, $sql)) {
                registrarCambio($usuario_nombre, "Cliente agregado: $nombre $apellido", 'Agregar', 'clientes', $conn);
                echo json_encode(['status' => 'success', 'message' => 'Cliente guardado con éxito']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al guardar el cliente: ' . mysqli_error($conn)]);
            }
        }
        break;

    case 'proveedor':
        // Obtener datos del proveedor
        $nombre = mysqli_real_escape_string($conn, $_POST['nombre_empresa']);
        $email = mysqli_real_escape_string($conn, $_POST['email_proveedor']);
        $numero = mysqli_real_escape_string($conn, $_POST['numero_proveedor']);
        $web = mysqli_real_escape_string($conn, $_POST['web_proveedor']);

        // Verificar si el proveedor ya existe por web
        $sql_check = "SELECT * FROM proveedores WHERE web='$web'";
        $result_check = mysqli_query($conn, $sql_check);

        if (mysqli_num_rows($result_check) > 0) {
            echo json_encode(['status' => 'error', 'message' => 'La web ya está registrada']);
        } else {
            // Insertar nuevo proveedor
            $sql = "INSERT INTO proveedores (nombre_empresa, email, numero, web)
                    VALUES ('$nombre', '$email', '$numero', '$web')";

            if (mysqli_query($conn, $sql)) {
                registrarCambio($usuario_nombre, "Proveedor agregado: $nombre", 'Agregar', 'proveedores', $conn);
                echo json_encode(['status' => 'success', 'message' => 'Proveedor guardado con éxito']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al guardar el proveedor: ' . mysqli_error($conn)]);
            }
        }
        break;

    case 'producto':
        // Obtener datos del producto
        $nombre = mysqli_real_escape_string($conn, $_POST['nombre_producto']);
        $cantidad = mysqli_real_escape_string($conn, $_POST['cantidad_producto']);
        $proveedor = mysqli_real_escape_string($conn, $_POST['proveedor_producto']);
        $precio_c = mysqli_real_escape_string($conn, $_POST['precio_compra']);
        $precio = mysqli_real_escape_string($conn, $_POST['precio_producto']);
        $marca = mysqli_real_escape_string($conn, $_POST['marca_producto']);
        $categoria = mysqli_real_escape_string($conn, $_POST['categoria_producto']);

        // Verificar si el producto ya existe por nombre
        $sql_check = "SELECT * FROM productos WHERE nombre='$nombre'";
        $result_check = mysqli_query($conn, $sql_check);

        if (mysqli_num_rows($result_check) > 0) {
            echo json_encode(['status' => 'error', 'message' => 'El producto ya está registrado']);
        } else {
            // Insertar nuevo producto
            $sql = "INSERT INTO productos (nombre, cantidad, proveedor ,precio, precio_compra, marca, codigo)
                    VALUES ('$nombre', $cantidad,'$proveedor' ,$precio,$precio_c ,'$marca', '$categoria')";

            if (mysqli_query($conn, $sql)) {
                registrarCambio($usuario_nombre, "Producto agregado: $nombre", 'Agregar', 'productos', $conn);
                echo json_encode(['status' => 'success', 'message' => 'Producto guardado con éxito']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al guardar el producto: ' . mysqli_error($conn)]);
            }
        }
        break;

    case 'servicio':
        // Obtener datos del servicio
        $nombre_servicio = mysqli_real_escape_string($conn, $_POST['nombre_servicio']);
        $descripcion = mysqli_real_escape_string($conn, $_POST['descripcion_servicio']); // Asegúrate de que este nombre coincida
        $productos = isset($_POST['productos_json']) ? $_POST['productos_json'] : '[]'; // Validar que no esté vacío
        $coste_servicio = mysqli_real_escape_string($conn, $_POST['costo_servicio']);
        $coste_total = mysqli_real_escape_string($conn, $_POST['total_costo_servicio']); // Nombre corregido

        // Verificar si algún valor está vacío o nulo (opcional, pero recomendable)
        if (empty($nombre_servicio) || empty($descripcion) || empty($coste_total)) {
            echo json_encode(['status' => 'error', 'message' => 'Datos incompletos para el servicio']);
            break;
        }

        // Insertar nuevo servicio
        $sql = "INSERT INTO servicios (nombre, descripcion, productos,costo_servicio ,coste_total)
                VALUES ('$nombre_servicio', '$descripcion', '$productos',$coste_servicio ,$coste_total)";

        if (mysqli_query($conn, $sql)) {
            registrarCambio($usuario_nombre, "Servicio agregado: $nombre_servicio", 'Agregar', 'servicios', $conn);
            echo json_encode(['status' => 'success', 'message' => 'Servicio guardado con éxito']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al guardar el servicio: ' . mysqli_error($conn)]);
        }
        break;

    case 'venta':
        $cedula = mysqli_real_escape_string($conn, $_POST['cedula_cliente']);
        $productos = isset($_POST['productos_json']) ? $_POST['productos_json'] : '[]';
        $servicios = isset($_POST['servicios_json']) ? $_POST['servicios_json'] : '[]';
        $iva = mysqli_real_escape_string($conn, $_POST['iva_venta']);
        $total_pagar = mysqli_real_escape_string($conn, $_POST['total_venta']);
        $metodo_pago = mysqli_real_escape_string($conn, $_POST['metodo_pago']);
        $vendedor = mysqli_real_escape_string($conn, $_POST['vendedor_venta']);

        // Insertar nueva venta utilizando solo la cédula para identificar al cliente
        $sql = "INSERT INTO ventas (cedula_cliente, productos, servicios, iva, total_pagar, metodo, vendedor)
                VALUES ('$cedula', '$productos', '$servicios', '$iva', '$total_pagar', '$metodo_pago','$vendedor')";

        if (mysqli_query($conn, $sql)) {
            registrarCambio($usuario_nombre, "Venta realizada para cliente: $cedula", 'Agregar', 'ventas', $conn);
            echo json_encode(['status' => 'success', 'message' => 'Venta registrada con éxito']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al registrar la venta: ' . mysqli_error($conn)]);
        }
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Tipo no válido']);
        break;
}

mysqli_close($conn);
