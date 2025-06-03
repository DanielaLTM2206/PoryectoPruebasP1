<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once 'db.php';
// Obtener datos del usuario
$usuario = $_SESSION['usuario'];
$sql_user = "SELECT * FROM perfiles WHERE usuario = '$usuario'";
$result_user = mysqli_query($conn, $sql_user);
$user = mysqli_fetch_assoc($result_user);

$permisos = isset($_SESSION['permisos']) ? $_SESSION['permisos'] : [];

mysqli_close($conn);
