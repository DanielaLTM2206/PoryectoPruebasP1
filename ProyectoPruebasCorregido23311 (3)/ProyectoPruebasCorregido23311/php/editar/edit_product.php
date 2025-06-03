<?php
session_start();
/* @SuppressWarnings("php:S4833") */
include_once '../db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $conn->prepare("SELECT * FROM productos WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $producto = $result->fetch_assoc();

    if ($producto) {
        ?>
        <section id="formSection1">
            <form id="editForm" action="editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="producto">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($producto['id']); ?>">

                <h1 class="centered-title">Actualizar Producto</h1>

                <div class="form-group">
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value="<?php echo htmlspecialchars($producto['nombre']); ?>"
                        required
                        pattern="^[A-Za-z\s]+$"
                        title="El nombre debe contener solo letras y espacios."
                    >
                    <label for="nombre">Nombre</label>
                </div>

                <div class="form-group">
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value="<?php echo htmlspecialchars($producto['codigo']); ?>"
                        required
                        pattern="^[A-Za-z0-9\-]+$"
                        title="El código debe contener solo letras, números y guiones."
                    >
                    <label for="codigo">Código</label>
                </div>

                <div class="form-group">
                    <input
                        type="number"
                        id="cantidad"
                        name="cantidad"
                        value="<?php echo htmlspecialchars($producto['cantidad']); ?>"
                        required
                        min="0"
                        title="La cantidad debe ser un número mayor o igual a 0."
                    >
                    <label for="cantidad">Cantidad</label>
                </div>

                <div class="form-group">
                    <input
                        type="number"
                        id="precio"
                        name="precio"
                        value="<?php echo htmlspecialchars($producto['precio']); ?>"
                        required
                        min="0"
                        step="0.01"
                        title="El precio debe ser un número mayor o igual a 0."
                    >
                    <label for="precio">Precio</label>
                </div>

                <div class="form-group">
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        rows="3"
                        required
                        title="La descripción es obligatoria."
                    ><?php echo htmlspecialchars($producto['descripcion']); ?></textarea>
                    <label for="descripcion">Descripción</label>
                </div>

                <p class="centrar">
                    <button type="submit">Actualizar Producto</button>
                </p>
            </form>
        </section>
        <?php
    } else {
        echo '<p>Producto no encontrado.</p>';
    }
} else {
    echo '<p>ID no proporcionado.</p>';
}
?>
