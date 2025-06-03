

global.fetch = jest.fn();

beforeEach(() => {
  document.body.innerHTML = `
    <input id="vendedor_venta" />
    <select id="producto_venta"></select>
    <select id="servicio_venta"></select>
    <ul id="productosAñadidosList"></ul>
    <ul id="serviciosAñadidosList"></ul>
    <input id="metodo_pago" />
    <div id="efectivoFields" style="display:none"></div>
    <input id="monto_entregado" />
    <input id="cambio" />
    <input id="total_venta" value="100" />
    <div id="messageContainer"></div>
    <button id="addProduct"></button>
    <button id="addService"></button>
    <input id="cantidad_producto_venta" />
    <input id="cantidad_servicio_venta" />
    <input id="productos_json" />
    <input id="servicios_json" />
  `;

  fetch.mockClear();
});

test("loadUserInfo sets vendedor_venta input value", async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({
      success: true,
      nombre: "Juan",
      apellido: "Perez",
    }),
  });

  const loadUserInfo = () => {
    return fetch("get_vendedor.php")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const nombreCompleto = `${data.nombre} ${data.apellido}`;
          document.getElementById("vendedor_venta").value = nombreCompleto;
        }
      });
  };

  await loadUserInfo();

  expect(document.getElementById("vendedor_venta").value).toBe("Juan Perez");
});

test("loadProducts sets innerHTML of producto_venta", async () => {
  fetch.mockResolvedValueOnce({
    text: async () => "<option value=\"1\">Producto 1</option>",
  });

  const loadProducts = () => {
    return fetch("fetch_products.php")
      .then(res => res.text())
      .then(data => {
        document.getElementById("producto_venta").innerHTML = data;
      });
  };

  await loadProducts();

  expect(document.getElementById("producto_venta").innerHTML).toContain("Producto 1");
});

test("verificarStock returns stock number", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    text: async () => "10",
  });

  const verificarStock = async (productoId) => {
    const response = await fetch("check_stock.php", {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: `id=${productoId}`,
    });
    if (!response.ok) throw new Error("Error en la solicitud.");
    const stockDisponible = parseInt(await response.text(), 10);
    if (isNaN(stockDisponible)) throw new Error("Error al consultar el stock.");
    return stockDisponible;
  };

  const stock = await verificarStock(1);
  expect(stock).toBe(10);
  expect(fetch).toHaveBeenCalledWith("check_stock.php", expect.any(Object));
});

test("addProduct shows error when stock insufficient", async () => {
  document.getElementById("producto_venta").innerHTML = "<option value=\"1\" data-costo=\"100\">Producto A</option>";
  document.getElementById("producto_venta").value = "1";
  document.getElementById("cantidad_producto_venta").value = "5";

  const verificarStock = jest.fn().mockResolvedValue(3);

  const showMessage = jest.fn();

  const addProductBtn = document.getElementById("addProduct");
  addProductBtn.onclick = () => {
    const productoSelect = document.getElementById("producto_venta");
    const cantidadInput = document.getElementById("cantidad_producto_venta");

    const productoId = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value, 10);

    if (productoId && cantidad > 0) {
      verificarStock(productoId).then(stockDisponible => {
        if (stockDisponible < cantidad) {
          showMessage("error", "No hay suficiente stock para este producto.");
        }
      });
    }
  };

  addProductBtn.click();

  await new Promise(process.nextTick);

  expect(showMessage).toHaveBeenCalledWith("error", "No hay suficiente stock para este producto.");
});

const productosSeleccionados = [];
const serviciosSeleccionados = [];

document.body.innerHTML = `
  <input id="iva_venta" value="12" />
  <input id="total_venta" />
`;

global.productosSeleccionados = productosSeleccionados;
global.serviciosSeleccionados = serviciosSeleccionados;

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


describe("calcularTotal", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="iva_venta" value="12" />
      <input id="total_venta" />
    `;

    productosSeleccionados.length = 0;
    serviciosSeleccionados.length = 0;
  });

  test("calcula total correctamente con productos y servicios", () => {
    productosSeleccionados.push({ cantidad: 2, costo: 50 });  
    serviciosSeleccionados.push({ cantidad: 1, costo: 30 }); 

    calcularTotal();

    expect(document.getElementById("total_venta").value).toBe("145.60");
  });

  test("calcula total correctamente con solo productos", () => {
    productosSeleccionados.push({ cantidad: 3, costo: 20 });  
    calcularTotal();
    expect(document.getElementById("total_venta").value).toBe("67.20");
  });

  test("calcula total correctamente con solo servicios", () => {
    serviciosSeleccionados.push({ cantidad: 4, costo: 15 });  
    calcularTotal();
    expect(document.getElementById("total_venta").value).toBe("67.20");
  });

  test("maneja IVA vacío o no numérico", () => {
    document.getElementById("iva_venta").value = "";
    productosSeleccionados.push({ cantidad: 1, costo: 100 });
    calcularTotal();
    expect(document.getElementById("total_venta").value).toBe("100.00");
  });

  test("actualiza total cuando cambia el valor de IVA", () => {
    productosSeleccionados.push({ cantidad: 1, costo: 100 });
    document.getElementById("iva_venta").addEventListener("input", calcularTotal);

    calcularTotal();
    expect(document.getElementById("total_venta").value).toBe("112.00");

    document.getElementById("iva_venta").value = "0";
    document.getElementById("iva_venta").value = "0";
    document.getElementById("iva_venta").dispatchEvent(new Event("input"));

    expect(document.getElementById("total_venta").value).toBe("100.00");

    document.getElementById("iva_venta").value = "50";
    document.getElementById("iva_venta").value = "0";
    document.getElementById("iva_venta").dispatchEvent(new Event("input"));

    expect(document.getElementById("total_venta").value).toBe("100.00");
  });

});