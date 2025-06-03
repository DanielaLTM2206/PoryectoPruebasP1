
jest.useFakeTimers();

async function loadProviders() {
  try {
    const response = await fetch("fetch_providers.php");
    const options = await response.text();
    document.getElementById("proveedor_producto").innerHTML = options;
  } catch (error) {
    console.error("Error loading providers:", error);
  }
}

describe("loadProviders", () => {
  beforeEach(() => {
    document.body.innerHTML = "<select id=\"proveedor_producto\"></select>";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("<option value=\"1\">Proveedor 1</option>"),
      })
    );
  });

  it("should fetch provider data and update innerHTML", async () => {
    await loadProviders();
    const select = document.getElementById("proveedor_producto");
    expect(select.innerHTML).toBe("<option value=\"1\">Proveedor 1</option>");
    expect(fetch).toHaveBeenCalledWith("fetch_providers.php");
  });
});

function showMessage(type, message) {
  const messageBox = document.createElement("div");
  messageBox.className = `message ${type}`;
  messageBox.textContent = message;
  document.getElementById("messageContainer").appendChild(messageBox);

  setTimeout(() => {
    messageBox.style.opacity = 0;
    setTimeout(() => {
      document.getElementById("messageContainer").removeChild(messageBox);
    }, 300);
  }, 3000);
}

describe("showMessage", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id=\"messageContainer\"></div>";
  });

  it("should append message and remove it after timeout", () => {
    showMessage("success", "Guardado correctamente");
    const messageBox = document.querySelector(".message.success");

    expect(messageBox).not.toBeNull();
    expect(messageBox.textContent).toBe("Guardado correctamente");

    jest.advanceTimersByTime(3000);
    expect(messageBox.style.opacity).toBe("0");

    jest.advanceTimersByTime(300);
    expect(document.getElementById("messageContainer").children.length).toBe(0);
  });
});
describe("newProductForm submission", () => {
  let mockXHR;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="newProductForm" action="save_product.php">
        <input name="nombre" value="Producto X"/>
      </form>
      <div id="messageContainer"></div>
    `;

    mockXHR = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: null,
      status: 200,
      responseText: JSON.stringify({ status: "success", message: "Producto guardado" }),
    };

    global.XMLHttpRequest = jest.fn(() => mockXHR);

    const form = document.getElementById("newProductForm");
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const xhr = new XMLHttpRequest();
      xhr.open("POST", form.action, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showMessage(response.status, response.message);
          if (response.status === "success") {
            form.reset();
          }
        } else {
          showMessage("error", "Error en la conexión con el servidor");
        }
      };

      const formData = new FormData(form);
      const params = new URLSearchParams(formData).toString();
      xhr.send(params);
    });
  });

  it("should send AJAX POST and show success message on valid response", () => {
    const form = document.getElementById("newProductForm");
    const submitEvent = new Event("submit");
    form.dispatchEvent(submitEvent);

    expect(mockXHR.open).toHaveBeenCalledWith("POST", "http://localhost/save_product.php", true);
    expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Content-Type", "application/x-www-form-urlencoded");
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onload();

    const message = document.querySelector(".message.success");
    expect(message).not.toBeNull();
    expect(message.textContent).toBe("Producto guardado");
  });
});
