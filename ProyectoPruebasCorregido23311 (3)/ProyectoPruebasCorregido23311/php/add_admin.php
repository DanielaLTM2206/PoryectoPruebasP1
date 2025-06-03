<?php
session_start();
if (!isset($_SESSION['usuario']) || $_SESSION['perfil'] != 'admin') {
    
}

$conn = mysqli_connect('localhost', 'root', 'root', 'spa_base');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
    $apellido = mysqli_real_escape_string($conn, $_POST['apellido']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $usuario = mysqli_real_escape_string($conn, $_POST['usuario']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $perfil = 'admin'; // Solo se puede crear el primer admin desde aquí

    // Definir todos los permisos para el primer administrador
    $permisos = implode(',', [
        'Inicio',
        'Asignar',
        'Cliente',
        'Ventas',
        'Productos',
        'Servicios',
        'Proveedores',
        'Reportes'
    ]);

    $sql = "INSERT INTO perfiles (nombre, apellido, email, usuario, contraseña, perfil, permisos) 
            VALUES ('$nombre', '$apellido', '$email', '$usuario', '$password', '$perfil', '$permisos')";
    
    if (mysqli_query($conn, $sql)) {
        echo "Administrador creado exitosamente.";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Primer Administrador</title>
    <link rel="stylesheet" href="css/estilopaginas.css">
</head>
<body>
    <div class="form-container">
        <form action="add_admin.php" method="POST">
            <h1>Crear Primer Administrador</h1>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>
            
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="usuario">Usuario:</label>
            <input type="text" id="usuario" name="usuario" required>
            
            <label for="password">Contraseña:</label>
            <input type="password" id="password" name="password" required>
            
            <button type="submit">Crear Administrador</button>
        </form>
    </div>
</body>
</html>

