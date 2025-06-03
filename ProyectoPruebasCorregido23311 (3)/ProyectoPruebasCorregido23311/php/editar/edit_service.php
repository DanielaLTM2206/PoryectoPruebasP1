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
        $productStmt = $conn->prepare("SELECT * FROM productos WHERE estado = 'activo'");
        $productStmt->execute();
        $productResult = $productStmt->get_result();
        $productos = $productResult->fetch_all(MYSQLI_ASSOC);

        $productos_json = json_decode($servicio['productos'], true);

        $totalCost = 0;
        if (!empty($productos_json)) {
            foreach ($productos_json as $producto) {
                $prodStmt = $conn->prepare("SELECT precio FROM productos WHERE id = ?");
                $prodStmt->bind_param('i', $producto['id']);
                $prodStmt->execute();
                $prodResult = $prodStmt->get_result();
                $productoData = $prodResult->fetch_assoc();

                if ($productoData) {
                    $cost = $productoData['precio'] * $producto['cantidad'];
                    $totalCost += $cost;
                }
            }
        }

        echo '
        <section id="formSection1">
            <form id="editServiceForm" action="editar/update.php" method="POST">
                <input type="hidden" name="tipo" value="servicio">
                <input type="hidden" name="id" value="' . htmlspecialchars($servicio['id']) . '">
                <h1 class="centered-title">Actualizar Servicio</h1>
                
                <div class="form-group">
                    <input type="text" id="serviceName" readonly name="nombre_servicio" value="' . htmlspecialchars($servicio['nombre']) . '" required size="50%">
                    <label for="serviceName">Nombre del Servicio:</label>
                </div>

                <div class="form-group">
                    <select id="productSelect" name="producto_servicio">
                        <option value="" disabled selected>Selecciona un producto</option>';

        foreach ($productos as $producto) {
            echo '<option value="' . htmlspecialchars($producto['id']) . '" data-price="' . htmlspecialchars($producto['precio']) . '">' . htmlspecialchars($producto['nombre']) . '</option>';
        }

        echo '
                    </select>
                    <label for="productSelect">Producto:</label>
                </div>

                <div class="form-group">
                    <input type="number" id="productQuantity" name="cantidad_producto_servicio" step="1" min="1">
                    <label for="productQuantity">Cantidad del Producto:</label>
                </div>

                <button type="button" id="addProductButton">Añadir Producto</button>

                <!-- Listado de productos añadidos -->
                <div id="addedProductsContainer">
                    <h3>Productos Añadidos</h3>
                    <ul id="addedProductsList" class="addedProductsList">';

        if (!empty($productos_json)) {
            foreach ($productos_json as $producto) {
                $prodStmt = $conn->prepare("SELECT * FROM productos WHERE id = ?");
                $prodStmt->bind_param('i', $producto['id']);
                $prodStmt->execute();
                $prodResult = $prodStmt->get_result();
                $productoData = $prodResult->fetch_assoc();

                if ($productoData) {
                    $cost = $productoData['precio'] * $producto['cantidad'];

                    echo '<li data-id="' . htmlspecialchars($producto['id']) . '" data-price="' . htmlspecialchars($productoData['precio']) . '" data-quantity="' . htmlspecialchars($producto['cantidad']) . '">' . htmlspecialchars($productoData['nombre']) . ' - Cantidad: ' . htmlspecialchars($producto['cantidad']) . ' - Costo: ' . htmlspecialchars($cost) . ' <button type="button" class="removeProductButton">Eliminar</button></li>';
                }
            }
        }

        echo '
                    </ul>
                </div>

                <div class="form-group">
                    <textarea id="serviceDescription" name="descripcion" rows="4" required>' . htmlspecialchars($servicio['descripcion']) . '</textarea>
                    <label for="serviceDescription">Descripción del Servicio:</label>
                </div>

                <div class="form-group">
                    <input type="number" id="serviceCost" name="costo_servicio" step="0.01" min="0.01" value="' . htmlspecialchars($servicio['costo_servicio']) . '" required>
                    <label for="serviceCost">Costo del Servicio:</label>
                </div>

                <div class="form-group">
                    <input type="number" id="totalCost" name="coste_total" step="0.01" readonly value="' . htmlspecialchars($totalCost + $servicio['costo_servicio']) . '">
                    <label for="totalCost">Costo Total:</label>
                </div>
                
                <input type="hidden" name="productos_json" id="productos_json" value=\'' . htmlspecialchars(json_encode($productos_json)) . '\'>
                <p class="centrar">
                    <button type="submit">Actualizar Servicio</button>
                </p>
            </form>
        </section>';
    } else {
        echo '<p>Servicio no encontrado.</p>';
    }
} else {
    echo '<p>ID no proporcionado.</p>';
}
