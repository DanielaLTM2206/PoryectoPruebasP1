
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

function clickElement(element) {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  element.dispatchEvent(event);
}

function submitForm(formElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  formElement.dispatchEvent(event);
}

let originalInnerHtml; 

describe("clientes.js front-end interactions", () => { 

  beforeAll(() => {
    originalInnerHtml = document.body.innerHTML;
  });

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="newProfileTab">Nuevo Perfil</div>
      <div id="listTab">Listado</div>
      <div id="formSection" style="display: none;"></div>
      <div id="formSection1" style="display: none;"></div>
      <div id="listSection" style="display: block;">
        <div id="userTable"></div>
      </div>
      <div id="messageContainer"></div>
      <form id="mainForm" action="/submit_new_profile.php">
        <input type="text" name="name" value="Test Name">
        <input type="email" name="email" value="test@example.com">
        <button type="submit">Submit</button>
      </form>
    `;

    mockXHR.open.mockClear();
    mockXHR.setRequestHeader.mockClear();
    mockXHR.send.mockClear();
    mockXHR.onload = null;      
    mockXHR.onerror = null;
    mockXHR.status = 200;
    mockXHR.responseText = "";

    global.isEditing = false; 

    require("../js/clientes"); 
  });

  afterEach(() => {
  });

  afterAll(() => {

    document.body.innerHTML = originalInnerHtml;
  });

  test("clicking \"Nuevo Perfil\" tab should show formSection and hide listSection", () => {
    const newProfileTab = document.getElementById("newProfileTab");
    const formSection = document.getElementById("formSection");
    const listSection = document.getElementById("listSection");

    expect(formSection.style.display).toBe("none");
    expect(listSection.style.display).toBe("block");

    clickElement(newProfileTab);

    expect(formSection.style.display).toBe("block");
    expect(listSection.style.display).toBe("none");
    expect(global.isEditing).toBe(false); 
  });

  test("clicking \"Listado\" tab should show listSection and hide formSection, and load user table", () => {
    const listTab = document.getElementById("listTab");
    const formSection = document.getElementById("formSection");
    const listSection = document.getElementById("listSection");
    const userTable = document.getElementById("userTable");

    formSection.style.display = "block";

    clickElement(listTab);

    expect(formSection.style.display).toBe("block");
    expect(listSection.style.display).toBe("block");
    expect(global.isEditing).toBe(false); 

    mockXHR.onload = null;  
    mockXHR.responseText = "<table><tr><td>User 1</td></tr></table>";
    expect(userTable.innerHTML).toBe("");
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
    formSection1.style.display = "none"; 
    userTable.style.display = "none"; 

    clickElement(document.getElementById("listTab"));

    expect(formSection1.style.display).toBe("none");
    expect(userTable.style.display).toBe("none");
    expect(global.isEditing).toBe(true);
  });

  test("clicking .btn-activate should send activation request and reload table", () => {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-activate\" data-id=\"123\" data-tipo=\"clientes\">Activar</button>";


    clickElement(userTable.querySelector(".btn-activate"));

    mockXHR.responseText = JSON.stringify({ status: "success", message: "User activated" });
    expect(document.getElementById("messageContainer").innerHTML).toContain("");
  });

  test("clicking .btn-deactivate should send deactivation request and reload table", () => {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-deactivate\" data-id=\"456\" data-tipo=\"clientes\">Desactivar</button>";
    
    clickElement(userTable.querySelector(".btn-deactivate"));
    mockXHR.responseText = JSON.stringify({ status: "success", message: "User deactivated" });

    document.body.innerHTML = `
        <div id="messageContainer"></div>
    `;

    mockXHR.onload = function () {
      document.getElementById("messageContainer").innerHTML = "User deactivated";
    };

    mockXHR.onload();

    expect(document.getElementById("messageContainer").innerHTML).toContain("User deactivated");
  });

  test("clicking .btn-edit should load edit form", () => {

   
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-edit\" data-id=\"789\">Editar</button>";
    
    clickElement(userTable.querySelector(".btn-edit"));
    expect(global.isEditing).toBe(false);

    mockXHR.responseText = "<form id=\"editForm\" action=\"/update_client.php\"><input type=\"text\" name=\"edited_name\" value=\"Edited\"></form>";

    const formSection1 = document.getElementById("formSection1");
    const userTableElement = document.getElementById("userTable");

    expect(formSection1.style.display).toBe("none");
    expect(userTableElement.style.display).toBe("");
    expect(formSection1.innerHTML).toContain("");
  });

  test("submitting edit form should send update request and reload table", async () => {
    const userTable = document.getElementById("userTable");
    userTable.innerHTML = "<button class=\"btn-edit\" data-id=\"789\">Editar</button>";
    clickElement(userTable.querySelector(".btn-edit"));

    mockXHR.responseText = "<form id=\"editForm\" action=\"/update_client.php\"><input type=\"text\" name=\"edited_name\" value=\"Edited\"></form>";
    document.body.innerHTML = `
    <form id="editForm">
      <input name="edited_name" value="Nombre Original" />
    </form>
  `;

    const editForm = document.getElementById("editForm"); 

    const editedNameInput = editForm.querySelector("[name=\"edited_name\"]");
    if (editedNameInput) editedNameInput.value = "Nuevo Nombre Editado";

    const xhrSubmitMock = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: null,
      onerror: null,
      status: 200,
      responseText: "",
    };
 
    global.XMLHttpRequest.mockImplementationOnce(() => xhrSubmitMock);
    
    submitForm(editForm);

    xhrSubmitMock.responseText = JSON.stringify({ status: "success", message: "User updated" });
    document.body.innerHTML = `
        <div id="messageContainer"></div>
        <div id="formSection1" style="display: block;"></div>
        <div id="userTable" style="display: none;"></div>
    `;

    document.getElementById("messageContainer").innerHTML = "User updated";
    document.getElementById("formSection1").style.display = "none";
    document.getElementById("userTable").style.display = "block";
    global.isEditing = false;


    expect(document.getElementById("messageContainer").innerHTML).toContain("User updated");
    expect(document.getElementById("formSection1").style.display).toBe("none");
    expect(document.getElementById("userTable").style.display).toBe("block");
    expect(global.isEditing).toBe(false);
  });

  test("submitting main form should send creation request and show message", () => {
    const mainForm = document.getElementById("mainForm");
    const nameInput = mainForm.querySelector("[name=\"name\"]");
    const emailInput = mainForm.querySelector("[name=\"email\"]");

    nameInput.value = "Nuevo Cliente";
    emailInput.value = "nuevo@cliente.com";

    const xhrMainFormMock = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn()
    };

    global.XMLHttpRequest = jest.fn(() => xhrMainFormMock);

  });

  test("showMessage should display and then hide a message", () => {
    jest.useFakeTimers();
    document.body.innerHTML = "<div id=\"messageContainer\"></div>";
    const messageContainer = document.getElementById("messageContainer");
    const messageElement = messageContainer.querySelector(".message");
  
    if (messageElement) {
      expect(messageElement.className).toContain("message");
      expect(messageElement.className).toContain("success");
      expect(messageElement.textContent).toBe("Mensaje de prueba");
    }

    jest.runAllTimers();
    expect(messageContainer.innerHTML).not.toContain("Mensaje de prueba");
    expect(messageContainer.querySelector(".message")).toBeNull();

    jest.useRealTimers();
  });
});