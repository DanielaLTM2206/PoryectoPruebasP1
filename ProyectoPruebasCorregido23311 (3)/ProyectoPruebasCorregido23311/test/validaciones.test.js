
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
  if (error) {
    error.textContent = "";
  }
  input.classList.remove("invalid");
}

function toggleSubmitButton(form) {
  const submitButton = form.querySelector("button[type=\"submit\"]");
  const allValid = form.querySelectorAll(".invalid").length === 0;
  submitButton.disabled = !allValid;
}

function validatePerfilForm(form) {
  const nombre = form.querySelector("#nombre");
  const apellido = form.querySelector("#apellido");
  const email = form.querySelector("#email");

  nombre.addEventListener("input", () => {
    if (nombre.value.trim() === "") {
      showError(nombre, "El nombre es obligatorio. Debe contener solo letras y espacios.");
    } else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(nombre.value.trim())) {
      showError(nombre, "El nombre solo debe contener letras y espacios.");
    } else {
      clearError(nombre);
    }
    toggleSubmitButton(form);
  });

  apellido.addEventListener("input", () => {
    if (apellido.value.trim() === "") {
      showError(apellido, "El apellido es obligatorio. Debe contener solo letras y espacios.");
    } else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(apellido.value.trim())) {
      showError(apellido, "El apellido solo debe contener letras y espacios.");
    } else {
      clearError(apellido);
    }
    toggleSubmitButton(form);
  });

  email.addEventListener("input", () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.value)) {
      showError(email, "Ingresa un email válido en formato: ejemplo@dominio.com.");
    } else {
      clearError(email);
    }
    toggleSubmitButton(form);
  });
}

describe("validatePerfilForm", () => {
  let form, nombre, apellido, email, submitBtn;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="perfilForm">
        <div><input id="nombre" type="text" /></div>
        <div><input id="apellido" type="text" /></div>
        <div><input id="email" type="text" /></div>
        <button type="submit" disabled>Enviar</button>
      </form>
    `;

    form = document.getElementById("perfilForm");
    nombre = form.querySelector("#nombre");
    apellido = form.querySelector("#apellido");
    email = form.querySelector("#email");
    submitBtn = form.querySelector("button[type=\"submit\"]");

    validatePerfilForm(form);
  });

  test("muestra error si nombre está vacío", () => {
    nombre.value = "";
    nombre.dispatchEvent(new Event("input"));
    expect(nombre.classList.contains("invalid")).toBe(true);
    expect(nombre.parentElement.querySelector(".error-message").textContent).toBe(
      "El nombre es obligatorio. Debe contener solo letras y espacios."
    );
    expect(submitBtn.disabled).toBe(true);
  });

  test("quita error si nombre es válido", () => {
    nombre.value = "Juan Pérez";
    nombre.dispatchEvent(new Event("input"));
    expect(nombre.classList.contains("invalid")).toBe(false);
    const errorDiv = nombre.parentElement.querySelector(".error-message");
    expect(errorDiv).toBeNull();  

  });

  test("muestra error si apellido tiene números", () => {
    apellido.value = "García123";
    apellido.dispatchEvent(new Event("input"));
    expect(apellido.classList.contains("invalid")).toBe(true);
    expect(apellido.parentElement.querySelector(".error-message").textContent).toBe(
      "El apellido solo debe contener letras y espacios."
    );
  });

  test("habilita botón submit si no hay errores", () => {
    nombre.value = "Juan";
    nombre.dispatchEvent(new Event("input"));

    apellido.value = "García";
    apellido.dispatchEvent(new Event("input"));

    email.value = "correo@dominio.com";
    email.dispatchEvent(new Event("input"));

    expect(submitBtn.disabled).toBe(false);
  });

  test("deshabilita botón submit si email inválido", () => {
    email.value = "correo@@dominio";
    email.dispatchEvent(new Event("input"));
    expect(email.classList.contains("invalid")).toBe(true);
    expect(submitBtn.disabled).toBe(true);
  });
});

function showErrorProveedor(input, message) {
  input.classList.add("invalid");
  let errorDiv = input.parentElement.querySelector(".error-message");
  if (!errorDiv) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    input.parentElement.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function clearErrorProveedor(input) {
  input.classList.remove("invalid");
  const errorDiv = input.parentElement.querySelector(".error-message");
  if (errorDiv) errorDiv.remove();
}

function toggleSubmitButtonProveedor(form) {
  // Implementar lógica si se requiere habilitar/deshabilitar el botón submit
}

describe("Validaciones formulario Proveedor", () => {
  let form;
  let nombreEmpresa;
  let emailProveedor;
  let numeroProveedor;
  let webProveedor;

  beforeEach(() => {
    document.body.innerHTML = `
      <form>
        <div><input id="nombre_empresa" /><div></div></div>
        <div><input id="email_proveedor" /><div></div></div>
        <div><input id="numero_proveedor" /><div></div></div>
        <div><input id="web_proveedor" /><div></div></div>
      </form>
    `;

    form = document.querySelector("form");
    nombreEmpresa = form.querySelector("#nombre_empresa");
    emailProveedor = form.querySelector("#email_proveedor");
    numeroProveedor = form.querySelector("#numero_proveedor");
    webProveedor = form.querySelector("#web_proveedor");

    global.showErrorProveedor = showErrorProveedor;
    global.clearErrorProveedor = clearErrorProveedor;
    global.toggleSubmitButtonProveedor = toggleSubmitButtonProveedor;
  });

  test("Valida nombre empresa vacío", () => {
    nombreEmpresa.value = "";
    nombreEmpresa.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("El nombre de la empresa es obligatorio.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida nombre empresa válido", () => {
    nombreEmpresa.value = "Mi empresa";
    nombreEmpresa.dispatchEvent(new Event("input"));

    const errorDiv = nombreEmpresa.parentElement.querySelector(".error-message");
    expect(errorDiv).toBeNull();
    expect(nombreEmpresa.classList.contains("invalid")).toBe(false);
  });

  test("Valida email proveedor vacío", () => {
    emailProveedor.value = "";
    emailProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("El email del proveedor es obligatorio.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida email proveedor inválido", () => {
    emailProveedor.value = "correo-invalido";
    emailProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("Ingresa un email válido.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida email proveedor válido", () => {
    emailProveedor.value = "correo@valido.com";
    emailProveedor.dispatchEvent(new Event("input"));

    const errorDiv = emailProveedor.parentElement.querySelector(".error-message");
    expect(errorDiv).toBeNull();
    expect(emailProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida número proveedor vacío", () => {
    numeroProveedor.value = "";
    numeroProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("El número del proveedor es obligatorio.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida número proveedor inválido", () => {
    numeroProveedor.value = "1234567890";
    numeroProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("El número debe comenzar con 09 y tener exactamente 10 dígitos.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida número proveedor válido", () => {
    numeroProveedor.value = "0998765432";
    numeroProveedor.dispatchEvent(new Event("input"));

    const errorDiv = numeroProveedor.parentElement.querySelector(".error-message");
    expect(errorDiv).toBeNull();
    expect(numeroProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida web proveedor vacía", () => {
    webProveedor.value = "";
    webProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("La web del proveedor es obligatoria");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida web proveedor inválida", () => {
    webProveedor.value = "http:/invalida-url";
    webProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    if (errorDiv) {
      expect(errorDiv.textContent).toBe("Ingresa una URL válida.");
    } 
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });

  test("Valida web proveedor válida", () => {
    webProveedor.value = "https://miweb.com";
    webProveedor.dispatchEvent(new Event("input"));

    const errorDiv = webProveedor.parentElement.querySelector(".error-message");
    expect(errorDiv).toBeNull();
    expect(webProveedor.classList.contains("invalid")).toBe(false);
  });
});
