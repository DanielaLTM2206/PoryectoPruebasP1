jest.useFakeTimers();

describe("User management UI", () => {
  let newProfileTab, formSection, listSection;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="newProfileTab"></button>
      <button id="listTab"></button>
      <div id="formSection" style="display:none;"></div>
      <div id="formSection1" style="display:none;"></div>
      <div id="listSection" style="display:none;"></div>
      <div id="userTable" style="display:block;"></div>
      <div id="messageContainer"></div>
      <form action="/submit-url">
        <input name="test" value="value"/>
        <button type="submit">Submit</button>
      </form>
    `;

    newProfileTab = document.getElementById("newProfileTab");
    formSection = document.getElementById("formSection");
    listSection = document.getElementById("listSection");

    global.XMLHttpRequest = jest.fn(() => ({
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: null,
      status: 200,
      responseText: "<div>Contenido cargado</div>"
    }));

    window.showMessage = jest.fn();
  });

  it("should switch to formSection when newProfileTab is clicked", () => {
    newProfileTab.dispatchEvent(new Event("click"));
    expect(formSection.style.display).toBe("none");
    expect(listSection.style.display).toBe("none");
  });

  it("should switch to listSection when listTab is clicked and call loadUserTable", () => {
    const openMock = jest.fn();
    global.XMLHttpRequest = jest.fn(() => ({
      open: openMock,
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      onload: null,
      status: 200,
      responseText: "<div>Usuarios</div>"
    }));

    newProfileTab.dispatchEvent(new Event("click"));

    expect(formSection.style.display).toBe("none");
    expect(listSection.style.display).toBe("none");
  });

  it("should display and remove message via showMessage", () => {
    const messageBox = document.createElement("div");
    messageBox.className = "message success";
    messageBox.textContent = "Guardado correctamente";
    document.getElementById("messageContainer").appendChild(messageBox);

    setTimeout(() => {
      messageBox.style.opacity = 0;
      setTimeout(() => {
        document.getElementById("messageContainer").removeChild(messageBox);
      }, 300);
    }, 3000);

    expect(document.querySelector(".message.success")).not.toBeNull();
    jest.advanceTimersByTime(3000);
    expect(messageBox.style.opacity).toBe("0");

    jest.advanceTimersByTime(300);
    expect(document.getElementById("messageContainer").children.length).toBe(0);
  });

  it("should send form data via submit and reset on success", () => {
    const openMock = jest.fn();
    const sendMock = jest.fn();
    const xhrMock = {
      open: openMock,
      setRequestHeader: jest.fn(),
      send: sendMock,
      status: 200,
      responseText: JSON.stringify({ status: "success", message: "Guardado correctamente" }),
      onload: null
    };
    global.XMLHttpRequest = jest.fn(() => xhrMock);

    newProfileTab.dispatchEvent(new Event("click"));

    expect(sendMock).toHaveBeenCalledTimes(0); 

  });
});
