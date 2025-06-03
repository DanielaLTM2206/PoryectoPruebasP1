<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'config.php';
/* @SuppressWarnings("php:S4833") */
include_once 'verificar_permisos.php';
verificarPermiso('Ventas');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA - Ventas</title>
    <link rel="stylesheet" href="../css/estilopaginas.css">
    <link rel="stylesheet" href="../css/formulario.css">
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="user-info">
                <div class="username">
                    <?php echo htmlspecialchars($user['usuario']); ?>
                </div>
                <div class="avatar">
                    <img src="../img/avatar-male2.png" alt="Avatar">
                </div>
            </div>
            <button class="logout" id="logoutBtn">
                <i class="fa fa-sign-out-alt"></i> Cerrar sesión
            </button>
        </div>
    </div>

    <div class="sidebar">
        <h1>Ventas</h1>
        <p>&nbsp</p>
        <div class="avatar">
            <img src="../img/Untitled_logo_1_free-file.jpg" alt="Avatar">
        </div>
        <!-- Mostrar elementos de menú según permisos -->
        <?php
        $menuItems = [
            'Inicio'      => '../index.php',
            'Asignar'     => 'asignar.php',
            'Cliente'     => 'cliente.php',
            'Ventas'      => '#',
            'Productos'   => 'productos.php',
            'Servicios'   => 'servicios.php',
            'Proveedores' => 'proveedores.php',
            'Reportes'    => 'reportes.php'
        ];
        foreach ($menuItems as $permiso => $url):
            if (in_array($permiso, $permisos)): ?>
                <div class="menu-item">
                    <a href="<?php echo $permiso === 'Productos' ? 'productos.php' : $url; ?>">
                        <?php echo $permiso === 'Productos' ? 'Inventario' : $permiso; ?>
                    </a>
                </div>
        <?php endif; endforeach; ?>
    </div>

    <div class="main-content1">
        <!-- Mini Menú -->
        <div class="mini-menu">
            <a href="#" class="tab-button active" id="listTab">Facturas</a>
            <a href="#" class="tab-button" id="newProfileTab">Nueva Venta</a>
        </div>
        
        <!-- Listado de Ventas -->
        <section id="listSection">
            <div class="content">
                <div class="table-wrapper">
                    <h2>Listado de Ventas</h2>
                    <div id="userTable" class="table-container"></div>
                </div>
            </div>
        </section>

        <!-- Nueva Venta -->
        <section id="formSection" style="display: none;">
            <p>&nbsp;</p>
            <form id="newSaleForm" action="save.php" method="POST">
                <input type="hidden" name="tipo" value="venta">
                <h1 class="centered-title">Registro de Venta</h1>
                <!-- Buscar Cliente -->
                <div class="form-group">
                    <input type="text" id="search_cliente" placeholder="Buscar Cliente (Cédula)" size="30%">
                    <button type="button" id="searchClienteBtn">Buscar Cliente</button>
                </div>

                <!-- Datos del Cliente -->
                <h3>Datos del Cliente</h3>
                <?php
                $fields = [
                    ['nombre_cliente', 'Nombre:', 'text'],
                    ['apellido_cliente', 'Apellido:', 'text'],
                    ['cedula_cliente', 'Cédula:', 'text'],
                    ['numero_cliente', 'Número:', 'text'],
                    ['email_cliente', 'Email:', 'email'],
                    ['locacion_cliente', 'Locación:', 'text']
                ];
                foreach ($fields as [$id, $label, $type]): ?>
                    <div class="form-group">
                        <input type="<?php echo $type; ?>" id="<?php echo $id; ?>" name="<?php echo $id; ?>" readonly>
                        <label for="<?php echo $id; ?>"><?php echo $label; ?></label>
                    </div>
                <?php endforeach; ?>

                <!-- Productos y Servicios -->
                <h3>Facturación</h3>
                <div class="form-group">
                    <select id="producto_venta" name="producto_venta">
                        <!-- Opciones se llenarán mediante JavaScript -->
                    </select>
                    <label for="producto_venta">Producto:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="cantidad_producto_venta" name="cantidad_producto_venta" step="1" min="1" required>
                    <label for="cantidad_producto_venta">Cantidad del Producto:</label>
                    <button type="button" id="addProduct">Añadir Producto</button>
                </div>
                <div id="productosAñadidosContainer">
                    <h3>Productos Añadidos</h3>
                    <ul id="productosAñadidosList" class="addedProductsList"></ul>
                </div>
                <div class="form-group">
                    <select id="servicio_venta" name="servicio_venta">
                        <!-- Opciones se llenarán mediante JavaScript -->
                    </select>
                    <label for="servicio_venta">Servicio:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="cantidad_servicio_venta" name="cantidad_servicio_venta" step="1" min="1" required>
                    <label for="cantidad_servicio_venta">Cantidad de Servicios:</label>
                    <button type="button" id="addService">Añadir Servicio</button>
                </div>
                <div id="serviciosAñadidosContainer">
                    <h3>Servicios Añadidos</h3>
                    <ul id="serviciosAñadidosList" class="addedProductsList"></ul>
                </div>

                <div class="form-group">
                    <input type="number" id="iva_venta" name="iva_venta" step="0.01" value="15" required>
                    <label for="iva_venta">IVA (%) :</label>
                </div>
                <div class="form-group">
                    <input type="number" id="total_venta" name="total_venta" readonly>
                    <label for="total_venta">Total:</label>
                </div>
                <div class="form-group">
                    <select id="metodo_pago" name="metodo_pago" required>
                        <option value="disabled selected">Metodo</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta de Débito</option>
                    </select>
                    <label for="metodo_pago">Método de Pago:</label>
                </div>
                <!-- Campos adicionales para Efectivo -->
                <div id="efectivoFields" style="display: none;">
                    <div class="form-group">
                        <input type="number" id="monto_entregado" name="monto_entregado" step="0.01" min="0" required>
                        <label for="monto_entregado">Monto Entregado:</label>
                    </div>
                    <div class="form-group">
                        <input type="number" id="cambio" name="cambio" readonly>
                        <label for="cambio">Cambio:</label>
                    </div>
                </div>
                <h3>Datos del Vendedor</h3>
                <div class="form-group">
                    <input type="text" id="vendedor_venta" name="vendedor_venta" readonly>
                    <label for="vendedor_venta">Vendedor:</label>
                </div>
                
                <input type="hidden" name="productos_json" id="productos_json" required>
                <input type="hidden" name="servicios_json" id="servicios_json" required>
                <button type="submit">Guardar Venta</button>
            </form>
        </section>
    </div>

    <div id="logoutModal" style="display: none;">
        <div class="modal-content">
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <button id="confirmLogout">Sí</button>
            <button id="cancelLogout">No</button>
        </div>
    </div>

    <!-- Contenedor para mensajes flotantes -->
    <div id="messageContainer"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"
        integrity="sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="../js/codigos.js"></script>
    <script src="../js/ventas.js"></script>
    <script src="../js/validaciones.js"></script>
</body>
</html>
