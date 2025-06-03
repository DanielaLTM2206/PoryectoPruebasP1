<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM proveedores WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $proveedor = $result->fetch_assoc();

    if ($proveedor) {
        ?>
        <section id="formSection1">
            <form id="editForm" action="editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="proveedor">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($proveedor['id']); ?>">
                <h1 class="centered-title">Actualizar Proveedor</h1>
                
                <!-- Validación de Nombre de la Empresa -->
                <div class="form-group">
                    <input type="text" id="nombre_empresa" name="nombre_empresa" value="<?php echo htmlspecialchars($proveedor['nombre_empresa']); ?>" readonly required size="50%" oninput="this.setCustomValidity(this.value.trim() === '' ? 'El nombre de la empresa es obligatorio.' : '');">
                    <label for="nombre_empresa">Nombre de la Empresa:</label>
                </div>

                <!-- Validación de Email -->
                <div class="form-group">
                    <input type="email" id="email_proveedor" name="email_proveedor" value="<?php echo htmlspecialchars($proveedor['email']); ?>" required oninput="this.setCustomValidity(this.value.trim() === '' ? 'El email del proveedor es obligatorio.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value) ? 'Ingresa un email válido.' : '')); ?>">
                    <label for="email_proveedor">Email:</label>
                </div>

                <!-- Validación de Número -->
                <div class="form-group">
                    <input type="text" id="numero_proveedor" name="numero_proveedor" value="<?php echo htmlspecialchars($proveedor['numero']); ?>" required oninput="this.setCustomValidity(this.value.trim() === '' ? 'El número del proveedor es obligatorio.' : (!/^09\d{8}$/.test(this.value.trim()) ? 'El número debe comenzar con 09 y tener exactamente 10 dígitos.' : '')); ?>">
                    <label for="numero_proveedor">Número:</label>
                </div>

                <!-- Validación de Web -->
                <div class="form-group">
                    <input type="text" id="web_proveedor" name="web_proveedor" value="<?php echo htmlspecialchars($proveedor['web']); ?>" readonly required oninput="this.setCustomValidity(this.value.trim() === '' ? 'La web del proveedor es obligatoria.' : (!/^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)*$/.test(this.value) ? 'Ingresa una URL válida.' : '')); ?>">
                    <label for="web_proveedor">Web:</label>
                </div>
                
                <p class="centrar">
                    <button type="submit">Actualizar Proveedor</button>
                </p>
            </form>
        </section>
        <?php
    } else {
        echo '<p>Proveedor no encontrado.</p>';
    }
} else {
    ?>
    <section id="formSection2">
        <form action="save.php" method="POST">
            <input type="hidden" name="tipo" value="proveedor">
            <h1 class="centered-title">Registro Nuevo Proveedor</h1>
            
            <!-- Validación de Nombre de la Empresa -->
            <div class="form-group">
                <input type="text" id="nombre_empresa" name="nombre_empresa" required size="50%" oninput="this.setCustomValidity(this.value.trim() === '' ? 'El nombre de la empresa es obligatorio.' : '');">
                <label for="nombre_empresa">Nombre de la Empresa:</label>
            </div>

            <!-- Validación de Email -->
            <div class="form-group">
                <input type="email" id="email_proveedor" name="email_proveedor" required oninput="this.setCustomValidity(this.value.trim() === '' ? 'El email del proveedor es obligatorio.' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value) ? 'Ingresa un email válido.' : '')); ?>">
                <label for="email_proveedor">Email:</label>
            </div>

            <!-- Validación de Número -->
            <div class="form-group">
                <input type="text" id="numero_proveedor" name="numero_proveedor" required oninput="this.setCustomValidity(this.value.trim() === '' ? 'El número del proveedor es obligatorio.' : (!/^09\d{8}$/.test(this.value.trim()) ? 'El número debe comenzar con 09 y tener exactamente 10 dígitos.' : '')); ?>">
                <label for="numero_proveedor">Número:</label>
            </div>

            <!-- Validación de Web -->
            <div class="form-group">
                <input type="text" id="web_proveedor" name="web_proveedor" required oninput="this.setCustomValidity(this.value.trim() === '' ? 'La web del proveedor es obligatoria.' : (!/^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)*$/.test(this.value) ? 'Ingresa una URL válida.' : '')); ?>">
                <label for="web_proveedor">Web:</label>
            </div>

            <p class="centrar">
                <button type="submit">Guardar Proveedor</button>
            </p>
        </form>
    </section>
    <?php
}
?>
