document.addEventListener("DOMContentLoaded", () => {
  function showError(input, message) {
    let error = input.parentElement.querySelector(".error-message");
    if (!error) {
      error = document.createElement("div");
      error.className = "error-message";
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
    input.classList.add("invalid");
  }

  function clearError(input) {
    const error = input.parentElement.querySelector(".error-message");
    if (error) error.textContent = "";
    input.classList.remove("invalid");
  }

  function isAdult(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }

  function toggleSubmitButton(form) {
    const submitButton = form.querySelector("button[type=\"submit\"]");
    const allValid = form.querySelectorAll(".invalid").length === 0;
    submitButton.disabled = !allValid;
  }

  function validarCedulaInput(cedulaInput) {
    const valorCedula = cedulaInput.value.trim();
    const regexNumeros = /^\d{10}$/;
    if (valorCedula === "") {
      showError(cedulaInput, "La cédula es obligatoria. Debe contener solo números.");
      return;
    }
    if (!regexNumeros.test(valorCedula)) {
      showError(cedulaInput, "La cédula debe tener exactamente 10 dígitos.");
      return;
    }
    const digitoRegion = parseInt(valorCedula.substring(0, 2), 10);
    if (digitoRegion < 1 || digitoRegion > 24) {
      showError(cedulaInput, "Error: Esta cédula no pertenece a ninguna región.");
      return;
    }
    const ultimoDigito = parseInt(valorCedula.substring(9, 10), 10);
    const pares = [1, 3, 5, 7].reduce((acc, idx) => acc + parseInt(valorCedula[idx], 10), 0);
    function dobleYMenosNueve(idx) {
      const n = parseInt(valorCedula[idx], 10) * 2;
      return n > 9 ? n - 9 : n;
    }
    const impares = [0, 2, 4, 6, 8].reduce((acc, idx) => acc + dobleYMenosNueve(idx), 0);
    const sumaTotal = pares + impares;
    const primerDigitoSuma = parseInt(String(sumaTotal).substring(0, 1), 10);
    const decena = (primerDigitoSuma + 1) * 10;
    let digitoValidador = decena - sumaTotal;
    if (digitoValidador === 10) digitoValidador = 0;
    if (digitoValidador === ultimoDigito) {
      clearError(cedulaInput);
    } else {
      showError(cedulaInput, "Error: Cédula no válida.");
    }
  }

  // Validaciones para el formulario de Registro de Perfil
  function validatePerfilForm(form) {
    const nombre = form.querySelector("#nombre");
    const apellido = form.querySelector("#apellido");
    const email = form.querySelector("#email");
    const genero = form.querySelector("#genero");
    const fechaNacimiento = form.querySelector("#fecha_nacimiento");
    const cedula = form.querySelector("#cedula");
    const usuario = form.querySelector("#usuario");
    const contraseña = form.querySelector("#contraseña");
    const perfil = form.querySelector("#perfil");

    // Validar Nombre y Apellido
    [nombre, apellido].forEach(input => {
      input.addEventListener("input", () => {
        if (input.value.trim() === "") {
          showError(input, `El ${input === nombre ? "nombre" : "apellido"} es obligatorio. Debe contener solo letras y espacios.`);
        } else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim())) {
          showError(input, `El ${input === nombre ? "nombre" : "apellido"} solo debe contener letras y espacios.`);
        } else {
          clearError(input);
        }
        toggleSubmitButton(form);
      });
    });

    // Validar Email
    email.addEventListener("input", () => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(email.value)) {
        showError(email, "Ingresa un email válido en formato: ejemplo@dominio.com.");
      } else {
        clearError(email);
      }
      toggleSubmitButton(form);
    });

    // Validar Género
    genero.addEventListener("change", () => {
      if (genero.value === "") {
        showError(genero, "Selecciona un género.");
      } else {
        clearError(genero);
      }
      toggleSubmitButton(form);
    });

    // Validar Fecha de Nacimiento
    fechaNacimiento.addEventListener("change", () => {
      if (!isAdult(fechaNacimiento.value)) {
        showError(fechaNacimiento, "Debes ser mayor de 18 años. Ingresa una fecha válida.");
      } else {
        clearError(fechaNacimiento);
      }
      toggleSubmitButton(form);
    });

    // Validar Cédula
    cedula.addEventListener("input", () => {
      validarCedulaInput(cedula);
      toggleSubmitButton(form);
    });

    // Validar Usuario
    usuario.addEventListener("input", () => {
      if (usuario.value.trim() === "") {
        showError(usuario, "El nombre de usuario es obligatorio. Debe contener entre 4 y 20 caracteres.");
      } else if (!/^\w{4,20}$/.test(usuario.value.trim())) {
        showError(usuario, "El usuario solo debe contener letras, números y guiones bajos, entre 4 y 20 caracteres.");
      } else {
        clearError(usuario);
      }
      toggleSubmitButton(form);
    });

    // Validar Contraseña
    contraseña.addEventListener("input", () => {
      if (contraseña.value.trim() === "") {
        showError(contraseña, "La contraseña es obligatoria.");
      } else if (contraseña.value.length < 6) {
        showError(contraseña, "La contraseña debe tener al menos 6 caracteres.");
      } else if (!/[A-Z]/.test(contraseña.value)) {
        showError(contraseña, "La contraseña debe contener al menos una letra mayúscula.");
      } else if (!/\d/.test(contraseña.value)) {
        showError(contraseña, "La contraseña debe contener al menos un número.");
      } else {
        clearError(contraseña);
      }
      toggleSubmitButton(form);
    });

    // Validar Perfil
    perfil.addEventListener("input", () => {
      if (perfil.value.trim() === "") {
        showError(perfil, "El perfil es obligatorio.");
      } else {
        clearError(perfil);
      }
      toggleSubmitButton(form);
    });
  }

  // Validaciones para el formulario de Registro Nuevo Cliente
  function validateClienteForm(form) {
    const nombre = form.querySelector("#nombre");
    const apellido = form.querySelector("#apellido");
    const cedula = form.querySelector("#cedula");
    const numero = form.querySelector("#numero");
    const email = form.querySelector("#email");
    const fechaNacimiento = form.querySelector("#fecha_nacimiento");
    const genero = form.querySelector("#genero");
    const locacion = form.querySelector("#locacion");

    // Validar Nombre y Apellido
    [nombre, apellido].forEach(input => {
      input.addEventListener("input", () => {
        if (input.value.trim() === "") {
          showError(input, `El ${input === nombre ? "nombre" : "apellido"} es obligatorio. Debe contener solo letras y espacios.`);
        } else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(input.value.trim())) {
          showError(input, `El ${input === nombre ? "nombre" : "apellido"} solo debe contener letras y espacios.`);
        } else {
          clearError(input);
        }
        toggleSubmitButton(form);
      });
    });

    // Validar Cédula
    cedula.addEventListener("input", () => {
      validarCedulaInput(cedula);
      toggleSubmitButton(form);
    });

    // Validar Número de Teléfono
    numero.addEventListener("input", () => {
      const numeroPattern = /^09\d{8}$/;
      if (!numeroPattern.test(numero.value.trim())) {
        showError(numero, "El número de teléfono debe comenzar con 09 y tener exactamente 10 dígitos.");
      } else {
        clearError(numero);
      }
      toggleSubmitButton(form);
    });

    // Validar Email (opcional)
    email.addEventListener("input", () => {
      if (email.value.trim() !== "") {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email.value)) {
          showError(email, "Ingresa un email válido en formato: ejemplo@dominio.com.");
        } else {
          clearError(email);
        }
      } else {
        clearError(email);
      }
      toggleSubmitButton(form);
    });

    // Validar Fecha de Nacimiento
    fechaNacimiento.addEventListener("change", () => {
      if (!isAdult(fechaNacimiento.value)) {
        showError(fechaNacimiento, "Debes ser mayor de 18 años. Ingresa una fecha válida.");
      } else {
        clearError(fechaNacimiento);
      }
      toggleSubmitButton(form);
    });

    // Validar Género
    genero.addEventListener("change", () => {
      if (genero.value === "") {
        showError(genero, "Selecciona un género.");
      } else {
        clearError(genero);
      }
      toggleSubmitButton(form);
    });

    // Validar Locación
    locacion.addEventListener("input", () => {
      if (locacion.value.trim() === "") {
        showError(locacion, "La locación es obligatoria.");
      } else {
        clearError(locacion);
      }
      toggleSubmitButton(form);
    });
  }

  // Validaciones para el formulario de Registro Nuevo Producto
  function validateProductoForm(form) {
    const nombreProducto = form.querySelector("#nombre_producto");
    const proveedorProducto = form.querySelector("#proveedor_producto");
    const precioCompra = form.querySelector("#precio_compra");
    const precioProducto = form.querySelector("#precio_producto");
    const cantidadProducto = form.querySelector("#cantidad_producto");
    const marcaProducto = form.querySelector("#marca_producto");
    const categoriaProducto = form.querySelector("#categoria_producto");

    // Validar campos obligatorios
    [
      [nombreProducto, "El nombre del producto es obligatorio."],
      [proveedorProducto, "Selecciona un proveedor."],
      [precioCompra, "El precio de compra debe ser mayor a 0."],
      [precioProducto, "El precio de venta debe ser mayor a 0."],
      [cantidadProducto, "La cantidad debe ser 0 o mayor."],
      [marcaProducto, "La marca es obligatoria."],
      [categoriaProducto, "El código del producto es obligatorio."]
    ].forEach(([input, msg], idx) => {
      const eventType = idx === 1 ? "change" : "input";
      input.addEventListener(eventType, () => {
        let valid = true;
        switch (input) {
        case proveedorProducto:
          valid = input.value !== "";
          break;
        case precioCompra:
        case precioProducto:
          valid = input.value !== "" && parseFloat(input.value) > 0;
          break;
        case cantidadProducto:
          valid = input.value !== "" && parseInt(input.value) >= 0;
          break;
        case nombreProducto:
        case marcaProducto:
        case categoriaProducto:
          valid = input.value.trim() !== "";
          break;
        }
        if (!valid) showError(input, msg);
        else clearError(input);
        toggleSubmitButton(form);
      });
    });
  }

  // Validaciones para el formulario de Registro Nuevo Proveedor
  function validateProveedorForm(form) {
    const nombreEmpresa = form.querySelector("#nombre_empresa");
    const emailProveedor = form.querySelector("#email_proveedor");
    const numeroProveedor = form.querySelector("#numero_proveedor");
    const webProveedor = form.querySelector("#web_proveedor");

    // Validar Nombre de la Empresa
    nombreEmpresa.addEventListener("input", () => {
      if (nombreEmpresa.value.trim() === "") {
        showError(nombreEmpresa, "El nombre de la empresa es obligatorio.");
      } else {
        clearError(nombreEmpresa);
      }
      toggleSubmitButton(form);
    });

    // Validar Email del Proveedor
    emailProveedor.addEventListener("input", () => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailProveedor.value.trim() === "") {
        showError(emailProveedor, "El email del proveedor es obligatorio.");
      } else if (!emailPattern.test(emailProveedor.value)) {
        showError(emailProveedor, "Ingresa un email válido.");
      } else {
        clearError(emailProveedor);
      }
      toggleSubmitButton(form);
    });

    // Validar Número del Proveedor
    numeroProveedor.addEventListener("input", () => {
      const numeroPattern = /^09\d{8}$/;
      if (numeroProveedor.value.trim() === "") {
        showError(numeroProveedor, "El número del proveedor es obligatorio.");
      } else if (!numeroPattern.test(numeroProveedor.value.trim())) {
        showError(numeroProveedor, "El número debe comenzar con 09 y tener exactamente 10 dígitos.");
      } else {
        clearError(numeroProveedor);
      }
      toggleSubmitButton(form);
    });

    // Validar Web del Proveedor
    webProveedor.addEventListener("input", () => {
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      if (webProveedor.value.trim() === "") {
        showError(webProveedor, "La web del proveedor es obligatoria.");
      } else if (!urlPattern.test(webProveedor.value)) {
        showError(webProveedor, "Ingresa una URL válida.");
      } else {
        clearError(webProveedor);
      }
      toggleSubmitButton(form);
    });
  }

  // Validaciones para el formulario de Registro Nuevo Servicio
  function validateServicioForm(form) {
    const nombreServicio = form.querySelector("#nombre_servicio");
    const productoServicio = form.querySelector("#producto_servicio");
    const cantidadProductoServicio = form.querySelector("#cantidad_producto_servicio");
    const descripcionServicio = form.querySelector("#descripcion_servicio");
    const costoServicio = form.querySelector("#costo_servicio");
    const totalCostoServicio = form.querySelector("#total_costo_servicio");

    // Validar campos obligatorios
    [
      [nombreServicio, "El nombre del servicio es obligatorio."],
      [productoServicio, "Selecciona un producto."],
      [cantidadProductoServicio, "La cantidad debe ser al menos 1."],
      [descripcionServicio, "La descripción es obligatoria."],
      [costoServicio, "El costo debe ser mayor a 0."]
    ].forEach(([input, msg], idx) => {
      const eventType = idx === 1 ? "change" : "input";
      input.addEventListener(eventType, () => {
        let valid = true;
        if ((input === productoServicio && input.value === "") ||
                    (input === cantidadProductoServicio && (input.value === "" || parseInt(input.value) < 1)) ||
                    (input === nombreServicio && input.value.trim() === "") ||
                    (input === descripcionServicio && input.value.trim() === "") ||
                    (input === costoServicio && (input.value === "" || parseFloat(input.value) <= 0))) {
          valid = false;
        }
        if (!valid) showError(input, msg);
        else {
          clearError(input);
          if (input === costoServicio) totalCostoServicio.value = parseFloat(costoServicio.value).toFixed(2);
        }
        toggleSubmitButton(form);
      });
    });
  }

  // Validaciones para el formulario de Registro de Venta
  function validateVentaForm(form) {
    const ivaVenta = form.querySelector("#iva_venta");
    const totalVenta = form.querySelector("#total_venta");
    const metodoPago = form.querySelector("#metodo_pago");
    const montoEntregado = form.querySelector("#monto_entregado");
    const cambio = form.querySelector("#cambio");

    metodoPago.addEventListener("change", () => {
      if (metodoPago.value === "efectivo") {
        document.getElementById("efectivoFields").style.display = "block";
      } else {
        document.getElementById("efectivoFields").style.display = "none";
        montoEntregado.value = "";
        cambio.value = "";
        clearError(montoEntregado);
      }
      toggleSubmitButton(form);
    });

    montoEntregado.addEventListener("input", () => {
      updateTotal();
      const total = parseFloat(totalVenta.value) || 0;
      const entregado = parseFloat(montoEntregado.value) || 0;
      if (entregado < total) {
        showError(montoEntregado, "El monto entregado debe ser igual o mayor al total.");
        cambio.value = "";
      } else {
        clearError(montoEntregado);
        cambio.value = (entregado - total).toFixed(2);
      }
      toggleSubmitButton(form);
    });

    ivaVenta.addEventListener("input", () => {
      if (parseFloat(ivaVenta.value) >= 0) {
        clearError(ivaVenta);
        calcularTotalVenta();
      } else {
        showError(ivaVenta, "El IVA debe ser 0 o mayor.");
      }
      toggleSubmitButton(form);
    });

    function calcularTotalVenta() {
      let total = 0;
      const productosJson = form.querySelector("#productos_json").value;
      if (productosJson) {
        const productos = JSON.parse(productosJson);
        productos.forEach(prod => {
          total += parseFloat(prod.costo) * parseInt(prod.cantidad, 10);
        });
      }
      const serviciosJson = form.querySelector("#servicios_json").value;
      if (serviciosJson) {
        const servicios = JSON.parse(serviciosJson);
        servicios.forEach(serv => {
          total += parseFloat(serv.costo) * parseInt(serv.cantidad, 10);
        });
      }
      const iva = parseFloat(ivaVenta.value) || 0;
      total += (total * iva) / 100;
      totalVenta.value = total.toFixed(2);
      const entregado = parseFloat(montoEntregado.value) || 0;
      if (entregado >= total) {
        cambio.value = (entregado - total).toFixed(2);
      } else {
        cambio.value = "";
      }
    }

    function updateTotal() {
      calcularTotalVenta();
      const total = parseFloat(totalVenta.value) || 0;
      const entregado = parseFloat(montoEntregado.value) || 0;
      if (entregado >= total) {
        cambio.value = (entregado - total).toFixed(2);
      }
    }

    form.addEventListener("productosActualizados", calcularTotalVenta);
    form.addEventListener("serviciosActualizados", calcularTotalVenta);

    form.querySelectorAll("input").forEach(input => {
      if (input.id.startsWith("producto_") || input.id.startsWith("servicio_")) {
        input.addEventListener("input", calcularTotalVenta);
      }
    });

    document.addEventListener("DOMContentLoaded", calcularTotalVenta);
  }

  // Agregar validaciones según el tipo de formulario
  const forms = document.querySelectorAll("form");
  forms.forEach(form => {
    const tipo = form.querySelector("input[name=\"tipo\"]");
    if (tipo) {
      switch (tipo.value) {
      case "perfil":
        validatePerfilForm(form);
        break;
      case "cliente":
        validateClienteForm(form);
        break;
      case "producto":
        validateProductoForm(form);
        break;
      case "proveedor":
        validateProveedorForm(form);
        break;
      case "servicio":
        validateServicioForm(form);
        break;
      case "venta":
        validateVentaForm(form);
        break;
      default:
        console.warn(`No se encontraron validaciones para el tipo: ${tipo.value}`);
      }
    }
  });

  // Estilos para indicar campos inválidos y mensajes de error
  const style = document.createElement("style");
  style.innerHTML = `
        .invalid {
            border: 2px solid red;
        }
        .error-message {
            color: red;
            font-size: 0.9em;
            margin-top: 5px;
        }
    `;
  document.head.appendChild(style);
});
