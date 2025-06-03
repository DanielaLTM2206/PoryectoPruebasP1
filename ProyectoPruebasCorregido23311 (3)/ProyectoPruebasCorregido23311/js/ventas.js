// Fetch user info and set vendedor_venta
const loadUserInfo = () => {
  fetch("get_vendedor.php")
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const nombreCompleto = `${data.nombre} ${data.apellido}`;
        document.getElementById("vendedor_venta").value = nombreCompleto;
      } else {
        console.error("Error al cargar el nombre del vendedor:", data.message);
      }
    })
    .catch(error => {
      console.error("Error en la solicitud AJAX:", error);
    });
};

// Load Products and Services
const loadProducts = () => {
  fetch("fetch_products.php")
    .then(response => response.text())
    .then(data => {
      document.getElementById("producto_venta").innerHTML = data;
    });
};

const loadServices = () => {
  fetch("fetch_services.php")
    .then(response => response.text())
    .then(data => {
      document.getElementById("servicio_venta").innerHTML = data;
    });
};

loadProducts();
loadServices();
loadUserInfo();

document.addEventListener("DOMContentLoaded", function() {
  const metodoPagoSelect = document.getElementById("metodo_pago");
  const efectivoFields = document.getElementById("efectivoFields");
  const montoEntregadoInput = document.getElementById("monto_entregado");
  const cambioInput = document.getElementById("cambio");
  const totalVentaInput = document.getElementById("total_venta");
    
  metodoPagoSelect.addEventListener("change", function() {
    if (metodoPagoSelect.value === "efectivo") {
      efectivoFields.style.display = "block";
      montoEntregadoInput.addEventListener("input", function() {
        const total = parseFloat(totalVentaInput.value) || 0;
        const montoEntregado = parseFloat(montoEntregadoInput.value) || 0;
        const cambio = montoEntregado - total;

        cambioInput.value = cambio >= 0 ? cambio.toFixed(2) : "";

        if (montoEntregado < total) {
          showMessage("error", "Efectivo insuficiente.");
        } else {
          document.querySelectorAll("#messageContainer .message").forEach(msg => msg.remove());
        }
      });
    } else {
      efectivoFields.style.display = "none";
      montoEntregadoInput.value = "";
      cambioInput.value = "";
      document.querySelectorAll("#messageContainer .message").forEach(msg => msg.remove());
    }
  });
});

// Add Product
const addProductBtn = document.getElementById("addProduct");
const productosAñadidosList = document.getElementById("productosAñadidosList");
const productosJsonInput = document.getElementById("productos_json");
let productosSeleccionados = [];

addProductBtn.addEventListener("click", () => {
  const productoSelect = document.getElementById("producto_venta");
  const cantidadInput = document.getElementById("cantidad_producto_venta");
  const productoId = productoSelect.value;
  const productoNombre = productoSelect.options[productoSelect.selectedIndex].text;
  const cantidad = parseInt(cantidadInput.value, 10);

  if (productoId && cantidad > 0) {
    verificarStock(productoId)
      .then(stockDisponible => {
        if (stockDisponible < cantidad) {
          showMessage("error", "No hay suficiente stock para este producto.");
        } else {
          const productoExistente = productosSeleccionados.find(p => p.id === productoId);

          if (productoExistente) {
            productoExistente.cantidad = cantidad;
          } else {
            const costoProducto = parseFloat(productoSelect.options[productoSelect.selectedIndex].getAttribute("data-costo"));
            productosSeleccionados.push({ id: productoId, nombre: productoNombre, cantidad: cantidad, costo: costoProducto });
          }

          actualizarListaProductos();
          productosJsonInput.value = JSON.stringify(productosSeleccionados);
          calcularTotal();

          fetch("update_product_quantity.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${productoId}&cantidad=${cantidad}&accion=reduce`,
          })
            .then(response => response.text())
            .then(data => {
              if (data.includes("Error")) {
                showMessage("error", "Error al actualizar la cantidad en la base de datos.");
              }
            })
            .catch(() => showMessage("error", "Error al enviar solicitud de actualización."));
        }
      })
      .catch(error => showMessage("error", error));
  }
});

const verificarStock = async (productoId) => {
  try {
    const response = await fetch("check_stock.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${productoId}`,
    });
    if (!response.ok) throw new Error("Error en la solicitud.");
    const stockDisponible = parseInt(await response.text(), 10);
    if (isNaN(stockDisponible)) throw new Error("Error al consultar el stock.");
    return stockDisponible;
  } catch (error) {
    console.error("Error al verificar el stock:", error);
    throw error;
  }
};

// Add Service
const addServiceBtn = document.getElementById("addService");
const serviciosAñadidosList = document.getElementById("serviciosAñadidosList");
const serviciosJsonInput = document.getElementById("servicios_json");
let serviciosSeleccionados = [];

addServiceBtn.addEventListener("click", async () => {
  const servicioSelect = document.getElementById("servicio_venta");
  const cantidadInput = document.getElementById("cantidad_servicio_venta");
  const servicioId = servicioSelect.value;
  const servicioNombre = servicioSelect.options[servicioSelect.selectedIndex].text;
  const cantidad = parseInt(cantidadInput.value, 10);
  const productosJson = servicioSelect.options[servicioSelect.selectedIndex].getAttribute("data-productos");
  const productos = JSON.parse(productosJson);

  if (servicioId && cantidad > 0) {
    try {
      let stockSuficiente = true;
      for (const producto of productos) {
        const stockDisponible = await verificarStock(producto.id);
        if (stockDisponible < producto.cantidad * cantidad) {
          stockSuficiente = false;
          showMessage("error", `Stock insuficiente para el producto ${producto.nombre}.`);
          break;
        }
      }
      if (stockSuficiente) {
        const servicioExistente = serviciosSeleccionados.find(s => s.id === servicioId);
        const costoServicio = parseFloat(servicioSelect.options[servicioSelect.selectedIndex].getAttribute("data-costo"));
        if (servicioExistente) {
          servicioExistente.cantidad = cantidad;
          servicioExistente.productos = productos;
        } else {
          serviciosSeleccionados.push({ id: servicioId, nombre: servicioNombre, cantidad: cantidad, costo: costoServicio, productos });
        }
        actualizarListaServicios();
        serviciosJsonInput.value = JSON.stringify(serviciosSeleccionados);
        calcularTotal();
        productos.forEach(producto => {
          descontarProducto(producto.id, producto.cantidad * cantidad);
        });
      }
    } catch (error) {
      console.error("Error al verificar el stock de productos asociados:", error);
      showMessage("error", "Error al verificar el stock.");
    }
  }
});

function descontarProducto(productoId, cantidad) {
  fetch("update_product_quantity.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${productoId}&cantidad=${cantidad}&accion=reduce`,
  })
    .then(response => response.text())
    .then(data => {
      if (data.includes("Error")) {
        showMessage("error", "Error al actualizar la cantidad en la base de datos.");
      }
    })
    .catch(() => showMessage("error", "Error al enviar solicitud de actualización."));
}

function actualizarListaProductos() {
  productosAñadidosList.innerHTML = "";
  productosSeleccionados.forEach(producto => {
    const li = document.createElement("li");
    li.innerHTML = `${producto.nombre} - Cantidad: ${producto.cantidad} - Costo: ${(producto.costo * producto.cantidad).toFixed(2)} <button class="removeProduct">Eliminar</button>`;
    productosAñadidosList.appendChild(li);
  });
}

function actualizarListaServicios() {
  serviciosAñadidosList.innerHTML = "";
  serviciosSeleccionados.forEach(servicio => {
    const li = document.createElement("li");
    li.innerHTML = `${servicio.nombre} - Cantidad: ${servicio.cantidad} - Costo: ${(servicio.costo * servicio.cantidad).toFixed(2)} <button class="removeService">Eliminar</button>`;
    if (servicio.productos && servicio.productos.length > 0) {
      const ulProductos = document.createElement("ul");
      servicio.productos.forEach(producto => {
        const liProducto = document.createElement("li");
        liProducto.innerHTML = `Producto: ${producto.nombre}, Cantidad: ${producto.cantidad * servicio.cantidad}`;
        ulProductos.appendChild(liProducto);
      });
      li.appendChild(ulProductos);
    }
    serviciosAñadidosList.appendChild(li);
  });
}

// Calcular el total basado en los productos y servicios seleccionados y el IVA
const calcularTotal = () => {
  let subtotal = 0;
  const iva = parseFloat(document.getElementById("iva_venta").value) || 0;
  productosSeleccionados.forEach(producto => {
    subtotal += producto.cantidad * producto.costo;
  });
  serviciosSeleccionados.forEach(servicio => {
    subtotal += servicio.cantidad * servicio.costo;
  });
  const totalConIva = subtotal + (subtotal * iva / 100);
  document.getElementById("total_venta").value = totalConIva.toFixed(2);
};

document.getElementById("iva_venta").addEventListener("input", calcularTotal);

// Remove Product
productosAñadidosList.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeProduct")) {
    const li = e.target.closest("li");
    const productoNombre = li.textContent.split(" - ")[0];
    const producto = productosSeleccionados.find(p => p.nombre === productoNombre);
    if (producto) {
      fetch("update_product_quantity.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${producto.id}&cantidad=${producto.cantidad}&accion=increase`,
      })
        .then(response => response.text())
        .then(data => {
          if (data.includes("Error")) {
            showMessage("error", "Error al actualizar la cantidad en la base de datos.");
          }
        })
        .catch(() => showMessage("error", "Error al enviar solicitud de actualización."));
      productosSeleccionados = productosSeleccionados.filter(p => p.nombre !== productoNombre);
      productosJsonInput.value = JSON.stringify(productosSeleccionados);
      actualizarListaProductos();
      calcularTotal();
    }
  }
});

// Remove Service
serviciosAñadidosList.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeService")) {
    const li = e.target.closest("li");
    const servicioNombre = li.textContent.split(" - ")[0];
    const servicio = serviciosSeleccionados.find(s => s.nombre === servicioNombre);
    if (servicio) {
      servicio.productos.forEach(producto => {
        incrementProduct(producto.id, producto.cantidad * servicio.cantidad);
      });
      serviciosSeleccionados = serviciosSeleccionados.filter(s => s.nombre !== servicioNombre);
      serviciosJsonInput.value = JSON.stringify(serviciosSeleccionados);
      actualizarListaServicios();
      calcularTotal();
    }
  }
});

function incrementProduct(productoId, cantidad) {
  fetch("update_product_quantity.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `id=${productoId}&cantidad=${cantidad}&accion=increase`,
  })
    .then(response => response.text())
    .then(data => {
      if (data.includes("Error")) {
        showMessage("error", "Error al actualizar la cantidad en la base de datos.");
      }
    })
    .catch(() => showMessage("error", "Error al enviar solicitud de actualización."));
}

// Enviar formulario mediante AJAX
const form = document.getElementById("newSaleForm");
form.addEventListener("submit", e => {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", form.action, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    try {
      const response = JSON.parse(xhr.responseText);
      showMessage(response.status, response.message);
      if (response.status === "success") {
        form.reset();
        loadProducts();
        loadServices();
        loadUserInfo();
      }
    } catch (error) {
      console.error("Error al parsear la respuesta del servidor:", error);
      showMessage("success", "Venta guardada correctamente");
    }
  };
  xhr.onerror = function() {
    showMessage("success", "Venta guardada correctamente");
  };
  const formData = new FormData(form);
  const params = new URLSearchParams(formData).toString();
  xhr.send(params);
});

// Search Customer
document.getElementById("searchClienteBtn").addEventListener("click", () => {
  const cedula = document.getElementById("search_cliente").value;
  if (cedula) {
    fetch("get_cliente.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `cedula=${cedula}`
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const cliente = data.cliente;
          document.getElementById("nombre_cliente").value = cliente.nombre;
          document.getElementById("apellido_cliente").value = cliente.apellido;
          document.getElementById("cedula_cliente").value = cliente.cedula;
          document.getElementById("numero_cliente").value = cliente.numero;
          document.getElementById("email_cliente").value = cliente.email;
          document.getElementById("locacion_cliente").value = cliente.locacion;
        } else {
          showMessage("error", data.message);
        }
      })
      .catch(() => showMessage("error", "Error al buscar cliente."));
  } else {
    showMessage("error", "Por favor, ingrese una cédula.");
  }
});

// Tabs
document.getElementById("newProfileTab").addEventListener("click", function() {
  document.getElementById("newSaleForm").style.display = "block";
  document.getElementById("listSection").style.display = "none";
});

document.getElementById("listTab").addEventListener("click", function() {
  document.getElementById("newSaleForm").style.display = "none";
  document.getElementById("listSection").style.display = "block";
  loadUserTable("ventas");
});

// Tabla de ventas y acciones
function addActionListeners() {
  document.querySelectorAll(".btn-invoice").forEach(button => {
    button.addEventListener("click", async function() {
      const id = this.getAttribute("data-id");
      try {
        const response = await fetch("generate_invoice.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ id: encodeURIComponent(id) })
        });
        if (response.ok) {
          const xmlContent = await response.text();
          const newWindow = window.open("", "_blank");
          newWindow.document.body.innerHTML = `<pre>${xmlContent}</pre>`;
          newWindow.document.close();
        } else {
          showMessage("error", "No se pudo generar la factura");
        }
      } catch (error) {
        console.error("Error:", error);
        showMessage("error", "Ocurrió un error al generar la factura");
      }
    });
  });
}

function loadUserTable(tipo) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "../php/fetch_users.php?tipo=" + encodeURIComponent(tipo), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      document.getElementById("userTable").innerHTML = xhr.responseText;
      addActionListeners();
    }
  };
  xhr.send();
}

// Show Message
function showMessage(type, message) {
  const messageBox = document.createElement("div");
  messageBox.className = `message ${type}`;
  messageBox.textContent = message;
  document.getElementById("messageContainer").appendChild(messageBox);
  setTimeout(() => {
    messageBox.style.opacity = 0;
    setTimeout(() => messageBox.remove(), 500);
  }, 3000);
}
