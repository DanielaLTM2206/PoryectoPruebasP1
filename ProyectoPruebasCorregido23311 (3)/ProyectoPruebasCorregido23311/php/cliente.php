<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'config.php';
/* @SuppressWarnings("php:S4833") */
include_once 'verificar_permisos.php';
verificarPermiso('Cliente');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cliente - SPA</title>
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
        <h1>Cliente</h1>
        <p>&nbsp</p>
        <div class="avatar">
            <img src="../img/Untitled_logo_1_free-file.jpg" alt="Avatar">
        </div>
        <!-- Mostrar elementos de menú según permisos -->
        <?php
        $menuItems = [
            'Inicio'      => '../index.php',
            'Asignar'     => 'asignar.php',
            'Cliente'     => '#',
            'Ventas'      => 'ventas.php',
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
            <a href="#" class="tab-button active" id="listTab">Clientes</a>
            <a href="#" class="tab-button" id="newProfileTab">Nuevo Cliente</a>
        </div>

        <!-- Contenido Principal -->
        <section id="listSection">
            <div class="content">
                <div class="table-wrapper">
                    <h2>Listado de Clientes</h2>
                    <div id="userTable" class="table-container"></div>
                </div>
            </div>
        </section>
        
        <section id="formSection" style="display:none;">
            <p>&nbsp</p>
            <form action="save.php" method="POST">
                <input type="hidden" name="tipo" value="cliente">
                <h1 class="centered-title">Registro Nuevo Cliente</h1>
                <div class="form-group">
                    <input type="text" id="nombre" name="nombre" required size="50%">
                    <label for="nombre">Nombres</label>
                </div>
                <div class="form-group">
                    <input type="text" id="apellido" name="apellido" required>
                    <label for="apellido">Apellidos</label>
                </div>
                <div class="form-group">
                    <input type="text" id="cedula" name="cedula" required>
                    <label for="cedula">Cédula</label>
                </div>
                <div class="form-group">
                    <input type="text" id="numero" name="numero" required>
                    <label for="numero">Numero</label>
                </div>
                <div class="form-group">
                    <input type="email" id="email" name="email">
                    <label for="email">Email</label>
                </div>
                <div class="form-group">
                    <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" required>
                    <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                </div>
                <div class="form-group">
                    <select id="genero" name="genero" required>
                        <option value="" disabled selected>Género</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                    <label for="genero">Género</label>
                </div>
                <div class="form-group">
                    <input type="text" id="locacion" name="locacion">
                    <label for="locacion">Locación</label>
                </div>
                <p class="centrar">
                    <button type="submit">Guardar Cliente</button>
                    <button type="reset">Restablecer</button>
                </p>
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
    <script src="../js/clientes.js"></script>
    <script src="../js/validaciones.js"></script>
</body>
</html>
