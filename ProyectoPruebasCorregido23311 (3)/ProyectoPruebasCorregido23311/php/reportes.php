<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'config.php';
/* @SuppressWarnings("php:S4833") */
include_once 'verificar_permisos.php';
verificarPermiso('Reportes');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA - Reportes</title>
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
        <h1>Reportes</h1>
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
            'Servicios'   => 'servicios.php',
            'Proveedores' => 'proveedores.php',
            'Reportes'    => '#'
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
            <a href="#" class="tab-button active" id="listTab">Listado Reportes</a>
        </div>
        <!-- Listado de Servicios -->
        <div class="content">
            <div class="table-wrapper">
                <div id="userTable" class="table-container"></div>
            </div>
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
    </div>

    <script>
        // Utilidad para mostrar mensajes flotantes
        function showMessage(type, message) {
            const messageBox = document.createElement('div');
            messageBox.className = 'message ' + type;
            messageBox.textContent = message;
            document.getElementById('messageContainer').appendChild(messageBox);

            setTimeout(() => {
                messageBox.style.opacity = 0;
                setTimeout(() => {
                    if (messageBox.parentNode) {
                        messageBox.parentNode.removeChild(messageBox);
                    }
                }, 300);
            }, 3000);
        }

        // Modal de logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            document.getElementById('logoutModal').style.display = 'block';
        });
        document.getElementById('cancelLogout').addEventListener('click', function() {
            document.getElementById('logoutModal').style.display = 'none';
        });
        document.getElementById('confirmLogout').addEventListener('click', function() {
            window.location.href = 'logout.php';
        });

        // Cargar tabla de reportes al iniciar
        document.addEventListener('DOMContentLoaded', function() {
            loadChangesTable();
        });

        function loadChangesTable() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'tabla_reportes.php', true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    document.getElementById('userTable').innerHTML = xhr.responseText;
                } else {
                    showMessage('error', 'Error al cargar los datos');
                }
            };
            xhr.send();
        }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"
        integrity="sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</body>
</html>
