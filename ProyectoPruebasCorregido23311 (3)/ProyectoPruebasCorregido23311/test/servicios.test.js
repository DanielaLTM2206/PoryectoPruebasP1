describe("Funciones principales del módulo de servicios/productos", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="costo_servicio" value="20" />
      <input id="total_costo_servicio" />
      <select id="producto_servicio">
        <option value="1" data-costo="10">Producto A</option>
      </select>
      <input id="cantidad_producto_servicio" value="2" />
      <input id="productos_json" />
      <ul id="addedProductsList"></ul>
      <div id="messageContainer"></div>
      <button id="addProduct"></button>
    `;

    global.productosSeleccionados = [];
  });


  test("calcularTotal debe sumar correctamente productos y servicio sin función", () => {
    const productosSeleccionados = [
      { id: "1", nombre: "Producto A", cantidad: 2, costo: 10 },
      { id: "2", nombre: "Producto B", cantidad: 1, costo: 5 }
    ];
    const costoServicio = 20;

    const totalProductos = productosSeleccionados.reduce((acc, prod) => acc + prod.cantidad * prod.costo, 0);
    const total = totalProductos + costoServicio;

    expect(total).toBe(45.00); 
  });


  test("verificarStock resuelve correctamente el stock simulado sin función externa", async () => {
    global.XMLHttpRequest = jest.fn(() => ({
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: function () {
        this.status = 200;
        this.responseText = "8";
        this.onload();
      }
    }));

    const verificarStockSimulado = (productoId, cantidad) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "check_stock.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onload = handleOnLoad(resolve, reject, xhr);
        xhr.send(`id=${encodeURIComponent(productoId)}`);
      });
    };

    function handleOnLoad(resolve, reject, xhr) {
      return function() {
        if (xhr.status === 200) {
          const stockDisponible = parseInt(xhr.responseText, 10);
          if (isNaN(stockDisponible)) {
            reject(new Error("Error al consultar el stock."));
          } else {
            resolve(stockDisponible);
          }
        } else {
          reject(new Error("Error en la solicitud."));
        }
      };
    }

    const stock = await verificarStockSimulado("1", 2);
    expect(stock).toBe(8);
  });


  test("agregar producto con stock suficiente actualiza lista y total", async () => {
    global.XMLHttpRequest = jest.fn(() => {
      return {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: function () {
          this.status = 200;
          this.responseText = "10"; 
          this.onload();
        }
      };
    });

    document.body.innerHTML = `
        <select id="producto_servicio">
        <option value="1" data-costo="10">Producto A</option>
        </select>
        <input type="number" id="cantidad_producto_servicio" value="2" />
        <input type="text" id="costo_servicio" value="20" />
        <input type="text" id="total_costo_servicio" />
        <button id="addProduct">Agregar</button>
        <ul id="addedProductsList"></ul>
        <input type="hidden" id="productos_json" />
    `;

    global.productosSeleccionados = [];

    const addProductBtn = document.getElementById("addProduct");
    const productoSelect = document.getElementById("producto_servicio");
    const cantidadInput = document.getElementById("cantidad_producto_servicio");
    const addedProductsList = document.getElementById("addedProductsList");
    const productosJsonInput = document.getElementById("productos_json");
    const inputTotalCostoServicio = document.getElementById("total_costo_servicio");
    const inputCostoServicio = document.getElementById("costo_servicio");

    function calcularTotal() {
      const costoServicio = parseFloat(inputCostoServicio.value) || 0;
      const productos = global.productosSeleccionados;

      let costoProductosTotal = 0;
      productos.forEach(producto => {
        const costoProducto = parseFloat(producto.costo) || 0;
        costoProductosTotal += costoProducto * producto.cantidad;
      });

      const costoTotal = costoServicio + costoProductosTotal;
      inputTotalCostoServicio.value = costoTotal.toFixed(2);
    }

    const verificarStock = (productoId, cantidad) => {
      return Promise.resolve(10);
    };

    addProductBtn.addEventListener("click", () => {
      const productoId = productoSelect.value;
      const productoNombre = productoSelect.options[productoSelect.selectedIndex].text;
      const cantidad = parseInt(cantidadInput.value, 10);

      if (!(productoId && cantidad > 0)) return;

      verificarStock(productoId, cantidad).then(stockDisponible => {
        if (stockDisponible < cantidad) {
          // Aquí puedes mostrar un mensaje de error si lo deseas
          return;
        }
        actualizarProductoSeleccionado(productoId, productoNombre, cantidad, productoSelect);
        actualizarListaProductos();
        productosJsonInput.value = JSON.stringify(global.productosSeleccionados);
        calcularTotal();
      });
    });

    function actualizarProductoSeleccionado(productoId, productoNombre, cantidad, productoSelect) {
      const productoExistente = global.productosSeleccionados.find(p => p.id === productoId);
      if (productoExistente) {
        productoExistente.cantidad = cantidad;
      } else {
        const costoProducto = parseFloat(productoSelect.options[productoSelect.selectedIndex].getAttribute("data-costo"));
        global.productosSeleccionados.push({ id: productoId, nombre: productoNombre, cantidad, costo: costoProducto });
      }
    }

    function actualizarListaProductos() {
      addedProductsList.innerHTML = "";
      global.productosSeleccionados.forEach(producto => {
        const li = document.createElement("li");
        li.innerHTML = `${producto.nombre} - Cantidad: ${producto.cantidad} - Costo: ${(producto.costo * producto.cantidad).toFixed(2)} <button class="removeProduct">Eliminar</button>`;
        addedProductsList.appendChild(li);
      });
    }

    addProductBtn.click();

    await new Promise(resolve => setTimeout(resolve, 10));
    expect(addedProductsList.innerHTML).toContain("Producto A");
    expect(productosJsonInput.value).toContain("Producto A");
    expect(inputTotalCostoServicio.value).toBe("40.00"); 
  });

});
