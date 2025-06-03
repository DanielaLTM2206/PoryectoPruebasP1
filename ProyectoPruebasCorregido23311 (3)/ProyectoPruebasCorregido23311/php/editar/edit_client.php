<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM clientes WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $cliente = $result->fetch_assoc();

    if ($cliente) {
        ?>
        <section id="formSection1">
            <form id="editForm" action="editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="cliente">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($cliente['id']); ?>">

                <h1 class="centered-title">Actualizar Cliente</h1>

                <div class="form-group">
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        size="50%"
                        value="<?php echo htmlspecialchars($cliente['nombre']); ?>"
                        required
                        readonly
                        pattern="^[A-Za-z\s]+$"
                        title="El nombre debe contener solo letras y espacios."
                    >
                    <label for="nombre">Nombres</label>
                </div>

                <div class="form-group">
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value="<?php echo htmlspecialchars($cliente['apellido']); ?>"
                        required
                        readonly
                        pattern="^[A-Za-z\s]+$"
                        title="El apellido debe contener solo letras y espacios."
                    >
                    <label for="apellido">Apellidos</label>
                </div>

                <div class="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        pattern="[^\s@]+@[^\s@]+\.[^\s@]+$"
                        value="<?php echo htmlspecialchars($cliente['email']); ?>"
                        title="Ingresa un email válido en formato: ejemplo@dominio.com."
                    >
                    <label for="email">Email</label>
                </div>

                <div class="form-group">
                    <select id="genero" name="genero" required>
                        <option value="M" <?php if ($cliente['genero'] === 'M') { echo 'selected'; } ?>>Masculino</option>
                        <option value="F" <?php if ($cliente['genero'] === 'F') { echo 'selected'; } ?>>Femenino</option>
                    </select>
                    <label for="genero">Género</label>
                </div>

                <div class="form-group">
                    <input
                        type="date"
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        value="<?php echo htmlspecialchars($cliente['fecha_nacimiento']); ?>"
                        required
                        readonly
                        min="<?php echo date('Y-m-d', strtotime('-100 years')); ?>"
                        max="<?php echo date('Y-m-d', strtotime('-18 years')); ?>"
                        title="Debes ser mayor de 18 años."
                    >
                    <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                </div>

                <div class="form-group">
                    <input
                        type="text"
                        id="cedula"
                        name="cedula"
                        value="<?php echo htmlspecialchars($cliente['cedula']); ?>"
                        required
                        readonly
                        pattern="^\d{10}$"
                        title="La cédula debe tener exactamente 10 dígitos y contener solo números."
                    >
                    <label for="cedula">Cédula</label>
                </div>

                <div class="form-group">
                    <input
                        type="text"
                        id="numero"
                        name="numero"
                        value="<?php echo htmlspecialchars($cliente['numero']); ?>"
                        required
                        pattern="^09\d{8}$"
                        title="El número de teléfono debe comenzar con 09 y tener exactamente 10 dígitos."
                    >
                    <label for="numero">Número</label>
                </div>

                <div class="form-group">
                    <input
                        type="text"
                        id="locacion"
                        name="locacion"
                        value="<?php echo htmlspecialchars($cliente['locacion']); ?>"
                        required
                        title="La locación es obligatoria."
                    >
                    <label for="locacion">Locación</label>
                </div>

                <p class="centrar">
                    <button type="submit">Actualizar Cliente</button>
                </p>
            </form>
        </section>
        <?php
    } else {
        echo '<p>Usuario no encontrado.</p>';
    }
} else {
    echo '<p>ID no proporcionado.</p>';
}
?>
