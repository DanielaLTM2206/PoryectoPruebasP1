<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM perfiles WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        ?>
        <section id="formSection1">
            <form id="editForm" action="editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="perfil">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($user['id']); ?>">
                <h1 class="centered-title">Actualizar Usuario</h1>

                <div class="form-group">
                    <input type="text" id="nombre" name="nombre" size="50%" value="<?php echo htmlspecialchars($user['nombre']); ?>" pattern="[A-Za-z\s]+" title="El nombre debe contener solo letras y espacios." required readonly>
                    <label for="nombre">Nombres</label>
                </div>

                <div class="form-group">
                    <input type="text" id="apellido" name="apellido" value="<?php echo htmlspecialchars($user['apellido']); ?>" pattern="[A-Za-z\s]+" title="El apellido debe contener solo letras y espacios." required readonly>
                    <label for="apellido">Apellidos</label>
                </div>

                <div class="form-group">
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($user['email']); ?>"
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Ingresa un email válido en formato: ejemplo@dominio.com."
                    required>
                    <label for="email">Email</label>
                </div>

                <div class="form-group">
                    <select id="genero" name="genero" required>
                        <option value="" disabled selected>Selecciona un género</option>
                        <option value="M" <?php if ($user['genero'] === 'M') { echo 'selected'; } ?>>Masculino</option>
                        <option value="F" <?php if ($user['genero'] === 'F') { echo 'selected'; } ?>>Femenino</option>
                    </select>
                    <label for="genero">Género</label>
                </div>

                <div class="form-group">
                    <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value="<?php echo htmlspecialchars($user['fecha_nacimiento']); ?>" max="<?php echo date('Y-m-d', strtotime('-18 years')); ?>" title="Debes ser mayor de 18 años." required readonly>
                    <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                </div>

                <div class="form-group">
                    <input type="text" id="cedula" name="cedula" value="<?php echo htmlspecialchars($user['cedula']); ?>" pattern="^\d{10}$" title="La cédula debe tener exactamente 10 dígitos y ser válida." readonly required>
                    <label for="cedula">Cédula</label>
                </div>

                <div class="form-group">
                    <input type="text" id="usuario" name="usuario" value="<?php echo htmlspecialchars($user['usuario']); ?>" pattern="[\w\d]{4,20}" title="El usuario debe contener entre 4 y 20 caracteres alfanuméricos y guiones bajos." required>
                    <label for="usuario">Usuario</label>
                </div>

                <div class="form-group">
                    <input type="password" id="contraseña" name="contraseña" pattern="(?=.*[A-Z])(?=.*[0-9]).{6,}" title="La contraseña debe tener al menos 6 caracteres, incluyendo una mayúscula y un número.">
                    <label for="contraseña">Contraseña (Dejar en blanco si no desea cambiarla)</label>
                </div>

                <div class="form-group">
                    <input type="text" id="perfil" name="perfil" value="<?php echo htmlspecialchars($user['perfil']); ?>" required>
                    <label for="perfil">Perfil</label>
                </div>

                <fieldset class="permissions-fieldset">
                    <legend>Permisos:</legend>
                    <div class="form-checkbox-row">
                        <input type="checkbox" id="perm_inicio" name="permisos[]" value="Inicio" <?php if (in_array('Inicio', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_inicio">Inicio</label>
                        <input type="checkbox" id="perm_asignar" name="permisos[]" value="Asignar" <?php if (in_array('Asignar', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_asignar">Asignar</label>
                        <input type="checkbox" id="perm_cliente" name="permisos[]" value="Cliente" <?php if (in_array('Cliente', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_cliente">Cliente</label>
                    </div>
                    <div class="form-checkbox-row">
                        <input type="checkbox" id="perm_ventas" name="permisos[]" value="Ventas" <?php if (in_array('Ventas', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_ventas">Ventas</label>
                        <input type="checkbox" id="perm_productos" name="permisos[]" value="Productos" <?php if (in_array('Productos', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_productos">Productos</label>
                        <input type="checkbox" id="perm_servicios" name="permisos[]" value="Servicios" <?php if (in_array('Servicios', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_servicios">Servicios</label>
                    </div>
                    <div class="form-checkbox-row">
                        <input type="checkbox" id="perm_proveedores" name="permisos[]" value="Proveedores" <?php if (in_array('Proveedores', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_proveedores">Proveedores</label>
                        <input type="checkbox" id="perm_reportes" name="permisos[]" value="Reportes" <?php if (in_array('Reportes', explode(',', $user['permisos']))) { echo 'checked'; } ?>>
                        <label for="perm_reportes">Reportes</label>
                    </div>
                </fieldset>

                <p class="centrar">
                    <button type="submit">Actualizar Usuario</button>
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
