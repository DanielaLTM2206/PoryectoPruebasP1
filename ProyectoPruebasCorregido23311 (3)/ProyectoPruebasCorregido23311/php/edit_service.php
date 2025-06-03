<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM servicios WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $servicio = $result->fetch_assoc();

    if ($servicio) {
        ?>
        <section id="formSection1">
            <form id="editServiceForm" action="../editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="servicio">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($servicio['id']); ?>"> <!-- Campo oculto para el ID -->
                <h1 class="centered-title">Actualizar Servicio</h1>
                
                <div class="form-group">
                    <input type="text" id="nombre_servicio" name="nombre_servicio" value="<?php echo htmlspecialchars($servicio['nombre']); ?>" required size="50%">
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
                    <textarea id="descripcion_servicio" name="descripcion_servicio" rows="4" required><?php echo htmlspecialchars($servicio['descripcion']); ?></textarea>
                    <label for="descripcion_servicio">Descripción del Servicio:</label>
                </div>

                <div class="form-group">
                    <input type="number" id="costo_servicio" name="costo_servicio" step="0.01" value="<?php echo htmlspecialchars($servicio['costo_servicio']); ?>" required>
                    <label for="costo_servicio">Costo del Servicio:</label>
                </div>

                <div class="form-group">
                    <input type="number" id="total_costo_servicio" name="total_costo_servicio" step="0.01" readonly value="<?php echo htmlspecialchars($servicio['coste_total']); ?>">
                    <label for="total_costo_servicio">Costo Total:</label>
                </div>

                <input type="hidden" name="productos_json" id="productos_json" value='<?php echo htmlspecialchars($servicio['productos_json']); ?>'>
                <p class="centrar">
                    <button type="submit">Actualizar Servicio</button>
                </p>
            </form>
        </section>

        <?php
    } else {
        echo '<p>Servicio no encontrado.</p>';
    }
} else {
    echo '<p>ID no proporcionado.</p>';
}
?>
