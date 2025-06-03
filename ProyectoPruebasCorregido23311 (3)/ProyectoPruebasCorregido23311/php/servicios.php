<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'config.php';
/* @SuppressWarnings("php:S4833") */
include_once 'verificar_permisos.php';
verificarPermiso('Servicios');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA - Servicios</title>
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
        <h1>Servicios</h1>
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
            'Ventas'      => 'ventas.php',
            'Productos'   => 'productos.php',
            'Servicios'   => '#',
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
            <a href="#" class="tab-button active" id="listTab">Servicios</a>
            <a href="#" class="tab-button" id="newProfileTab">Nuevo Servicio</a>
        </div>
        <!-- Listado de Servicios -->
        <section id="listSection">
            <div class="content">
                <div class="table-wrapper">
                    <h2>Listado de Servicios</h2>
                    <div id="userTable" class="table-container"></div>
                </div>
            </div>
        </section>

        <!-- Nuevo Servicio -->
        <section id="formSection" style="display: none;">
            <p>&nbsp</p>
            <form id="newServiceForm" action="save.php" method="POST">
                <input type="hidden" name="tipo" value="servicio">
                <h1 class="centered-title">Registro Nuevo Servicio</h1>
                <div class="form-group">
                    <input type="text" id="nombre_servicio" name="nombre_servicio" required size="50%">
                    <label for="nombre_servicio">Nombre del Servicio:</label>
                </div>
                <div class="form-group">
                    <select id="producto_servicio" name="producto_servicio">
                        <!-- Opciones se llenarán mediante JavaScript -->
                    </select>
                    <label for="producto_servicio">Producto:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="cantidad_producto_servicio" name="cantidad_producto_servicio" step="1" min="1">
                    <label for="cantidad_producto_servicio">Cantidad del Producto:</label>
                </div>
                <button type="button" id="addProduct">Añadir Producto</button>
                <!-- Listado de productos añadidos -->
                <div id="addedProductsContainer">
                    <h3>Productos Añadidos</h3>
                    <ul id="addedProductsList" class="addedProductsList"></ul>
                </div>
                <div class="form-group">
                    <textarea id="descripcion_servicio" name="descripcion_servicio" rows="4" required></textarea>
                    <label for="descripcion_servicio">Descripción del Servicio:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="costo_servicio" name="costo_servicio" step="0.01" required>
                    <label for="costo_servicio">Costo del Servicio:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="total_costo_servicio" name="total_costo_servicio" step="0.01" readonly>
                    <label for="total_costo_servicio">Costo Total:</label>
                </div>
                <input type="hidden" name="productos_json" id="productos_json">
                <button type="submit">Guardar Servicio</button>
            </form>
        </section>
        <section id="formSection1" style="display:none;">
            <!-- Este formulario será insertado dinámicamente -->
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
    <script src="../js/servicios.js" type="application/javascript"></script>
    <script src="../js/validaciones.js"></script>
</body>
</html>
