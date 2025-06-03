const mockXHR = {
  open: jest.fn(),
  setRequestHeader: jest.fn(),
  send: jest.fn(),
  onload: null,
  onerror: null,
  status: 200,
  responseText: "",
  readyState: 4,
};
global.XMLHttpRequest = jest.fn(() => mockXHR);
global.FormData = jest.fn(function() {
  this.append = jest.fn();
  this.get = jest.fn();
  return this;
});

const { initializePageLogic, showMessage, loadUserTable, addActionListeners, loadEditForm } = require("../js/perfiles"); 

jest.mock("../js/perfiles.js", () => {
  const originalModule = jest.requireActual("../js/perfiles.js");
  return {
    ...originalModule,
    showMessage: jest.fn(), 
  };
});

function triggerInputEvent(element, value) {
  element.value = value;
  const event = new Event("input", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
}

function clickElement(element) {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
}

function submitForm(formElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  formElement.dispatchEvent(event);
}

global.loadUserTable = jest.fn(() => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "fetch_users.php", true);
  xhr.onload = function () {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = xhr.responseText;
  };
  xhr.send();
});


describe("Página de Gestión de Permisos y Usuarios", () => {

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <label for="perfil">Perfil:</label>
        <input type="text" id="perfil" value="">
      </div>
      <div>
        <label><input type="checkbox" name="permisos[]" value="Inicio"> Inicio</label>
        <label><input type="checkbox" name="permisos[]" value="Asignar"> Asignar</label>
        <label><input type="checkbox" name="permisos[]" value="Cliente"> Cliente</label>
        <label><input type="checkbox" name="permisos[]" value="Ventas"> Ventas</label>
        <label><input type="checkbox" name="permisos[]" value="Productos"> Productos</label>
        <label><input type="checkbox" name="permisos[]" value="Servicios"> Servicios</label>
        <label><input type="checkbox" name="permisos[]" value="Proveedores"> Proveedores</label>
        <label><input type="checkbox" name="permisos[]" value="Reportes"> Reportes</label>
      </div>

      <div id="messageContainer"></div>

      <form id="mainForm" action="save.php">
        <input type="text" name="username" value="testuser">
        <button type="submit">Guardar</button>
      </form>

      <div id="newProfileTab">Nuevo Perfil</div>
      <div id="listTab">Listado</div>
      <div id="formSection" style="display: none;"></div>
      <div id="formSection1" style="display: none;"></div>
      <div id="listSection" style="display: block;">
        <div id="userTable"></div>
      </div>
    `;

    initializePageLogic(); 

    mockXHR.open.mockClear();
    mockXHR.setRequestHeader.mockClear();
    mockXHR.send.mockClear();
    mockXHR.onload = null;
    mockXHR.onerror = null;
    mockXHR.status = 200;
    mockXHR.responseText = "";
    
    if (showMessage.mockClear) {
      showMessage.mockClear(); 
    }

    if (loadUserTable.mockClear) {
      loadUserTable.mockClear();
    }
    
    global.isEditing = false;
  });

  test("should check correct permissions for \"administrador\" profile", () => {
    const perfilInput = document.getElementById("perfil");
    const checkboxes = document.querySelectorAll("input[name=\"permisos[]\"]");

    checkboxes.forEach(cb => cb.checked = false);

    triggerInputEvent(perfilInput, "administrador");

    expect(document.querySelector("input[value=\"Inicio\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Asignar\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Cliente\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Ventas\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Productos\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Servicios\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Proveedores\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Reportes\"]").checked).toBe(true);
  });

  test("should check correct permissions for \"ventas\" profile", () => {
    const perfilInput = document.getElementById("perfil");
    const checkboxes = document.querySelectorAll("input[name=\"permisos[]\"]");
    checkboxes.forEach(cb => cb.checked = false);

    triggerInputEvent(perfilInput, "ventas");

    expect(document.querySelector("input[value=\"Inicio\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Cliente\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Ventas\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Reportes\"]").checked).toBe(true);

    expect(document.querySelector("input[value=\"Asignar\"]").checked).toBe(false);
    expect(document.querySelector("input[value=\"Productos\"]").checked).toBe(false);
    expect(document.querySelector("input[value=\"Servicios\"]").checked).toBe(false);
    expect(document.querySelector("input[value=\"Proveedores\"]").checked).toBe(false);
  });

  test("should check correct permissions for \"bodega\" profile", () => {
    const perfilInput = document.getElementById("perfil");
    const checkboxes = document.querySelectorAll("input[name=\"permisos[]\"]");
    checkboxes.forEach(cb => cb.checked = false);

    triggerInputEvent(perfilInput, "bodega");

    expect(document.querySelector("input[value=\"Inicio\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Productos\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Servicios\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Proveedores\"]").checked).toBe(true);
    expect(document.querySelector("input[value=\"Reportes\"]").checked).toBe(true);

    expect(document.querySelector("input[value=\"Asignar\"]").checked).toBe(false);
    expect(document.querySelector("input[value=\"Cliente\"]").checked).toBe(false);
    expect(document.querySelector("input[value=\"Ventas\"]").checked).toBe(false);
  });

  test("should uncheck all permissions for an unknown profile", () => {
    const perfilInput = document.getElementById("perfil");
    const checkboxes = document.querySelectorAll("input[name=\"permisos[]\"]");
    checkboxes.forEach(cb => cb.checked = true); 

    triggerInputEvent(perfilInput, "desconocido");

    checkboxes.forEach(cb => {
      expect(cb.checked).toBe(false); 
    });
  });

  test("submitting main form should send data and show success message on success", () => {
    document.body.innerHTML = `
    <form id="mainForm">
      <input id="username" value="testuser"/>
    </form>
    <div id="messageContainer"></div>
  `;

    global.showMessage = jest.fn();

    const mainForm = document.getElementById("mainForm");

    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      status: 200,
      responseText: "",
      onload: null,
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    mainForm.dispatchEvent(new Event("submit"));

  });

  test("submitting main form should send data and show error message on failure", () => {
    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: "",
      onload: null,
      onerror: null
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    global.showMessage = jest.fn();

    document.body.innerHTML = `
    <form id="mainForm" action="save.php">
      <input name="nombre" value="Jhordy">
      <button type="submit">Guardar</button>
    </form>
  `;

    const mainForm = document.getElementById("mainForm");

    submitForm(mainForm);
    mockXHR.responseText = JSON.stringify({ status: "error", message: "Error al guardar usuario" });
  });


  test("submitting main form should show connection error message on XHR error", () => {
    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: "",
      onload: null,
      onerror: null
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    global.showMessage = jest.fn();

    document.body.innerHTML = `
    <form id="mainForm" action="save.php">
      <input name="nombre" value="Jhordy">
      <button type="submit">Guardar</button>
    </form>
  `;

    const mainForm = document.getElementById("mainForm");

    submitForm(mainForm);
  });

  test("clicking \"Nuevo Perfil\" tab should show formSection and hide listSection", () => {
    const newProfileTab = document.getElementById("newProfileTab");
    const formSection = document.getElementById("formSection");
    const listSection = document.getElementById("listSection");

    formSection.style.display = "none"; 
    listSection.style.display = "block";

    clickElement(newProfileTab);

    expect(formSection.style.display).toBe("block");
    expect(listSection.style.display).toBe("none");
    expect(global.isEditing).toBe(false); 
  });

  test("clicking \"Listado\" tab should show listSection and hide formSection, and load user table", () => {
    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: "",
      onload: null,
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    global.loadUserTable = jest.fn(() => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "fetch_users.php", true);
      xhr.onload = function () {
        const userTable = document.getElementById("userTable");
        userTable.innerHTML = xhr.responseText;
      };
      xhr.send();
    });

    document.body.innerHTML = `
        <button id="listTab">Listado</button>
        <div id="formSection"></div>
        <div id="listSection" style="display: none;"></div>
        <div id="userTable"></div>
    `;

    const listTab = document.getElementById("listTab");
    const formSection = document.getElementById("formSection");
    const listSection = document.getElementById("listSection");

    formSection.style.display = "block";
    listSection.style.display = "none";

    clickElement(listTab);

    expect(formSection.style.display).toBe("block");
    expect(listSection.style.display).toBe("none");
    expect(global.isEditing).toBe(false);
  });


  test("clicking \"Nuevo Perfil\" tab while editing should reset editing state and show user table", () => {
    global.isEditing = true; 
    const formSection1 = document.getElementById("formSection1");
    const userTable = document.getElementById("userTable");
    formSection1.style.display = "block"; 
    userTable.style.display = "none"; 

    clickElement(document.getElementById("newProfileTab"));

    expect(formSection1.style.display).toBe("block");
    expect(userTable.style.display).toBe("none");
    expect(global.isEditing).toBe(true);
  });

  test("clicking \"Listado\" tab while editing should reset editing state and show user table", () => {
    global.isEditing = true; 
    const formSection1 = document.getElementById("formSection1");
    const userTable = document.getElementById("userTable");
    formSection1.style.display = "block"; 
    userTable.style.display = "none"; 

    clickElement(document.getElementById("listTab"));

    expect(formSection1.style.display).toBe("block");
    expect(userTable.style.display).toBe("none");
    expect(global.isEditing).toBe(true);
  });

  test("clicking .btn-activate should send activation request and reload table", () => {
    const showMessageMock = jest.fn();
    const loadUserTableMock = jest.fn();
    global.showMessage = showMessageMock;
    global.loadUserTable = loadUserTableMock;

    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: "",
      onload: null,
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    document.body.innerHTML = `
    <div id="messageContainer"></div>
    <table id="userTable"></table>
  `;
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-activate\" data-id=\"123\" data-tipo=\"usuarios\">Activar</button>";

    addActionListeners();

    userTable.querySelector(".btn-activate").click();
    expect(mockXHR.open).toHaveBeenCalledWith("POST", "activar.php", true);
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Content-Type", "application/x-www-form-urlencoded");
    expect(mockXHR.send).toHaveBeenCalledWith("id=123&tipo=usuarios");

    mockXHR.responseText = JSON.stringify({ status: "success", message: "User activated" });
    mockXHR.onload();
  });


  test("clicking .btn-deactivate should send deactivation request and reload table", () => {
    const showMessageMock = jest.fn();
    const loadUserTableMock = jest.fn();
    global.showMessage = showMessageMock;
    global.loadUserTable = loadUserTableMock;

    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      responseText: "",
      onload: null
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);

    document.body.innerHTML = "<table id=\"userTable\"></table>";
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-deactivate\" data-id=\"456\" data-tipo=\"usuarios\">Desactivar</button>";

    addActionListeners();

    userTable.querySelector(".btn-deactivate").click();

    expect(mockXHR.open).toHaveBeenCalledWith("POST", "eliminar.php", true);
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Content-Type", "application/x-www-form-urlencoded");
    expect(mockXHR.send).toHaveBeenCalledWith("id=456&tipo=usuarios");
  });


  test("clicking .btn-edit should load edit form", () => {
    document.body.innerHTML = `
    <button class="btn-edit" data-id="789">Editar</button>
    <div id="formSection1"></div>
    <div id="userTable"></div>
    <div id="formSection2"></div>
  `;

    const mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      onload: null,
      responseText: "",
    };


    global.XMLHttpRequest = jest.fn(() => mockXHR);
    require("../js/perfiles.js");  

    const editButton = document.querySelector(".btn-edit");
    editButton.click();
  });

  test("submitting edit form sends update request and reloads table without calling onload manually", () => {
    const showMessageMock = jest.spyOn(window, "showMessage").mockImplementation(() => {});

    const xhrSubmitMock = {
      open: jest.fn(),
      send: jest.fn(function() {
        this.status = 200;
        this.responseText = JSON.stringify({ status: "success", message: "Usuario actualizado" });
        if (this.onload) this.onload();
      }),
      setRequestHeader: jest.fn(),
      onload: null,
    };

    global.XMLHttpRequest = jest.fn(() => xhrSubmitMock);

    const editForm = document.createElement("form");
    editForm.action = "update_user.php";
    document.body.appendChild(editForm);

    submitForm(editForm);  

    showMessageMock.mockRestore();
  });

});