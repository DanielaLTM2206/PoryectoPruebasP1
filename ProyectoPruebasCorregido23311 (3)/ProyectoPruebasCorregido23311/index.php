<?php
define('NO_SESSION_CHECK', true);
/* @SuppressWarnings("php:S4833") */
include_once 'php/db.php';
session_start();
if (!isset($_SESSION['usuario'])) {
    header('Location: php/login.php');
    exit();
}

// Obtener estadísticas
$stats_queries = [
    'clients_count'    => "SELECT COUNT(*) as total FROM clientes",
    'sales_count'      => "SELECT COUNT(*) as total FROM ventas",
    'products_count'   => "SELECT COUNT(*) as total FROM productos",
    'users_count'      => "SELECT COUNT(*) as total FROM perfiles",
    'services_count'   => "SELECT COUNT(*) as total FROM servicios",
    'providers_count'  => "SELECT COUNT(*) as total FROM proveedores"
];
// Obtener estadísticas
$stats = [];
foreach ($stats_queries as $key => $sql) {
    $result = mysqli_query($conn, $sql);
    $stats[$key] = mysqli_fetch_assoc($result)['total'];
}

$usuario = $_SESSION['usuario'];
$sql_user = "SELECT * FROM perfiles WHERE usuario = '$usuario'";
$result_user = mysqli_query($conn, $sql_user);
$user = mysqli_fetch_assoc($result_user);

$permisos = isset($_SESSION['permisos']) ? $_SESSION['permisos'] : [];

mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inicio - SPA</title>
    <link rel="stylesheet" href="css/estilopaginas.css">
</head>
<body>
<div class="header">
    <div class="header-content">
        <div class="user-info">
            <div class="username">
                <?php echo htmlspecialchars($user['usuario']); ?>
            </div>
            <div class="avatar">
                <img src="img/avatar-male2.png" alt="Avatar">
            </div>
        </div>
        <button class="logout" id="logoutBtn">
            <i class="fa fa-sign-out-alt"></i> Cerrar sesión
        </button>
    </div>
</div>

<div class="sidebar">
    <h1>Inicio</h1>
    <p>&nbsp</p>
    <div class="avatar">
        <img src="img/Untitled_logo_1_free-file.jpg" alt="Avatar">
    </div>
    <!-- Mostrar elementos de menú según permisos -->
    <?php
    $menuItems = [
        'Inicio'      => ['#', 'Inicio'],
        'Asignar'     => ['php/asignar.php', 'Asignar'],
        'Cliente'     => ['php/cliente.php', 'Cliente'],
        'Ventas'      => ['php/ventas.php', 'Ventas'],
        'Productos'   => ['php/productos.php', 'Inventario'],
        'Servicios'   => ['php/servicios.php', 'Servicios'],
        'Proveedores' => ['php/proveedores.php', 'Proveedores'],
        'Reportes'    => ['php/reportes.php', 'Reportes']
    ];
    foreach ($menuItems as $permiso => $item):
        if (in_array($permiso, $permisos)): ?>
            <div class="menu-item">
                <a href="<?php echo $item[0]; ?>"><?php echo $item[1]; ?></a>
            </div>
    <?php endif; endforeach; ?>
</div>

<div class="main-content">
    <h2>Estadísticas</h2>
    <div class="stats">
        <div class="stat-box">
            <i class="fa fa-users"></i>
            <div>Total Clientes</div>
            <div><?php echo $stats['clients_count']; ?></div>
        </div>
        <div class="stat-box">
            <i class="fa fa-shopping-cart"></i>
            <div>Total Ventas</div>
            <div><?php echo $stats['sales_count']; ?></div>
        </div>
        <div class="stat-box">
            <i class="fa fa-box"></i>
            <div>Total Productos</div>
            <div><?php echo $stats['products_count']; ?></div>
        </div>
        <div class="stat-box">
            <i class="fa fa-user"></i>
            <div>Total Usuarios</div>
            <div><?php echo $stats['users_count']; ?></div>
        </div>
        <div class="stat-box">
            <i class="fa fa-concierge-bell"></i>
            <div>Total Servicios</div>
            <div><?php echo $stats['services_count']; ?></div>
        </div>
        <div class="stat-box">
            <i class="fa fa-truck"></i>
            <div>Total Proveedores</div>
            <div><?php echo $stats['providers_count']; ?></div>
        </div>
    </div>
</div>

<div id="logoutModal" style="display: none;">
    <div class="modal-content">
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <button id="confirmLogout">Sí</button>
        <button id="cancelLogout">No</button>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"
        integrity="sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    document.getElementById('logoutBtn').addEventListener('click', function() {
        document.getElementById('logoutModal').style.display = 'block';
    });
    document.getElementById('cancelLogout').addEventListener('click', function() {
        document.getElementById('logoutModal').style.display = 'none';
    });
    document.getElementById('confirmLogout').addEventListener('click', function() {
        window.location.href = 'php/logout.php';
    });
</script>
</body>
</html>
