<?php
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';

define('NO_DISPONIBLE', 'No disponible');

if (isset($_POST['id'])) {
    $id = $_POST['id'];
    
    // Consulta para obtener los datos de la venta
    $query = "SELECT * FROM ventas WHERE id = $id";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        $venta = mysqli_fetch_assoc($result);
        
        // Decodificar los campos JSON
        $productos = json_decode($venta['productos'], true);
        $servicios = json_decode($venta['servicios'], true);
        $iva = $venta['iva'];

        // Obtener los datos del cliente usando la cédula
        $cedula_cliente = $venta['cedula_cliente'];
        $cliente_query = "SELECT * FROM clientes WHERE cedula = '$cedula_cliente'";
        $cliente_result = mysqli_query($conn, $cliente_query);

        if (mysqli_num_rows($cliente_result) > 0) {
            $cliente = mysqli_fetch_assoc($cliente_result);
        } else {
            $cliente = [
                'nombre' => NO_DISPONIBLE,
                'apellido' => NO_DISPONIBLE,
                'numero' => NO_DISPONIBLE,
                'email' => NO_DISPONIBLE,
                'locacion' => NO_DISPONIBLE
            ];
        }
        
        // Construir el HTML de la factura
        echo '<!DOCTYPE html>';
        echo '<html lang="es">';
        echo '<head>';
        echo '<meta charset="UTF-8">';
        echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
        echo '<title>Factura</title>';
        echo '<style>';
        echo 'body { font-family: Arial, sans-serif; margin: 0; padding: 0; }';
        echo '.container { width: 80%; margin: auto; border: 1px solid #000; padding: 20px; }';
        echo '.header { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }';
        echo '.header-content { display: flex; align-items: center; }';
        echo '.header img { width: 100px; height: auto; margin-right: 20px; }';
        echo '.header h1, .header p { margin: 0; }';
        echo '.details, .items { width: 100%; margin-bottom: 20px; }';
        echo '.items table { width: 100%; border-collapse: collapse; }';
        echo '.items table, .items th, .items td { border: 1px solid #000; }';
        echo '.items th, .items td { padding: 10px; text-align: left; }';
        echo '.totals { float: right; }';
        echo '.totals table { border: 1px solid #000; border-collapse: collapse; }';
        echo '.totals th, .totals td { border: none; padding: 5px 10px; }';
        echo '.footer { text-align: center; margin-top: 20px; }';
        echo '</style>';
        echo '</head>';
        echo '<body>';
        echo '<div class="container">';
        
        // Encabezado
        echo '<div class="header">';
        echo '<img src="../img/Untitled_logo_1_free-file.jpg" alt="Logo">';
        echo '<div>';
        echo '<h1>Serenity Hair & Spa</h1>';
        echo '<p>Sangolquí<br>0986247531<br>RUC: 0601780661001</p>';
        echo '</div>';
        echo '</div>';
        
        // Detalles de la factura
        echo '<div class="details">';
        echo '<h3>Datos de la Factura</h3>';
        echo '<p><strong>Id Factura:</strong> ' . $venta['id'] . '</p>';
        echo '<p><strong>Fecha de Venta:</strong> ' . $venta['fecha_creacion'] . '</p>';
        echo '<p><strong>Cédula del Cliente:</strong> ' . $venta['cedula_cliente'] . '</p>';
        echo '<p><strong>Vendedor:</strong> ' . $venta['vendedor'] . '</p>';
        echo '</div>';

        // Datos del cliente
        echo '<div class="details">';
        echo '<h3>Datos del Cliente</h3>';
        echo '<p><strong>Id Cliente:</strong> ' . (isset($cliente['id']) ? $cliente['id'] : NO_DISPONIBLE) . '</p>';
        echo '<p><strong>Nombres y Apellidos:</strong> ' . $cliente['nombre'] . ' ' . $cliente['apellido'] . '</p>';
        echo '<p><strong>Teléfono:</strong> ' . $cliente['numero'] . '</p>';
        echo '<p><strong>Email:</strong> ' . $cliente['email'] . '</p>';
        echo '<p><strong>Fecha de Nacimiento:</strong> ' . (isset($cliente['fecha_nacimiento']) ? $cliente['fecha_nacimiento'] : NO_DISPONIBLE) . '</p>';
        echo '<p><strong>Género:</strong> ' . (isset($cliente['genero']) ? $cliente['genero'] : NO_DISPONIBLE) . '</p>';
        echo '<p><strong>Ubicación:</strong> ' . $cliente['locacion'] . '</p>';
        echo '</div>';
        
        // Detalles de productos
        $total_productos = 0;
        echo '<div class="items">';
        echo '<h3>Productos</h3>';
        echo '<table>';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Descripción</th>';
        echo '<th>Cantidad</th>';
        echo '<th>Precio Unitario</th>';
        echo '<th>Total</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        
        if (!empty($productos)) {
            foreach ($productos as $producto) {
                $total_producto = $producto['cantidad'] * $producto['costo'];
                $total_productos += $total_producto;
                echo '<tr>';
                echo '<td>' . $producto['nombre'] . '</td>';
                echo '<td>' . $producto['cantidad'] . '</td>';
                echo '<td>' . number_format($producto['costo'], 2) . '</td>';
                echo '<td>' . number_format($total_producto, 2) . '</td>';
                echo '</tr>';
            }
        }
        
        echo '</tbody>';
        echo '</table>';
        echo '</div>';
        
        // Detalles de servicios
        $total_servicios = 0;
        echo '<div class="items">';
        echo '<h3>Servicios</h3>';
        echo '<table>';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Descripción</th>';
        echo '<th>Cantidad</th>';
        echo '<th>Precio Unitario</th>';
        echo '<th>Total</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        
        if (!empty($servicios)) {
            foreach ($servicios as $servicio) {
                $total_servicio = $servicio['cantidad'] * $servicio['costo'];
                $total_servicios += $total_servicio;
                echo '<tr>';
                echo '<td>' . $servicio['nombre'] . '</td>';
                echo '<td>' . $servicio['cantidad'] . '</td>';
                echo '<td>' . number_format($servicio['costo'], 2) . '</td>';
                echo '<td>' . number_format($total_servicio, 2) . '</td>';
                echo '</tr>';
                
                // Mostrar los productos incluidos en el servicio (si los hay)
                if (!empty($servicio['productos'])) {
                    echo '<tr>';
                    echo '<td colspan="4">';
                    echo '<strong>Productos incluidos en el servicio:</strong>';
                    echo '<ul>';
                    foreach ($servicio['productos'] as $producto_servicio) {
                        echo '<li>' . $producto_servicio['nombre'] . ' - Cantidad: ' . $producto_servicio['cantidad'] . ' - Costo: ' . number_format($producto_servicio['costo'], 2) . '</li>';
                    }
                    echo '</ul>';
                    echo '</td>';
                    echo '</tr>';
                }
            }
        }
        
        echo '</tbody>';
        echo '</table>';
        echo '</div>';
        
        // Totales
        $subtotal = $total_productos + $total_servicios;
        
        echo '<div class="totals">';
        echo '<table>';
        echo '<tr><th>Subtotal:</th><td>' . number_format($subtotal, 2) . '</td></tr>';
        echo '<tr><th>IVA:</th><td>' . number_format($iva, 2) . '</td></tr>';
        echo '<tr><th>Total a Pagar:</th><td>' . $venta['total_pagar'] . '</td></tr>';
        echo '</table>';
        echo '</div>';
        
        // Pie de página
        echo '<div class="footer">';
        echo '<p>Gracias por su compra.</p>';
        echo '<p>Las devoluciones se aceptan dentro de los primeros 15 días.</p>';
        echo '</div>';
        
        echo '</div>';
        echo '</body>';
        echo '</html>';
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Venta no encontrada']);
    }

    mysqli_close($conn);
} else {
    echo json_encode(['status' => 'error', 'message' => 'ID no proporcionado']);
}
