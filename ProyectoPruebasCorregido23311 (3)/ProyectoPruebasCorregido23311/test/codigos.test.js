
describe("Interacciones DOM principales", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="toggle-btn"></button>
      <div class="sidebar"></div>

      <button id="listTab" class="tab"></button>
      <button id="newProfileTab" class="tab"></button>
      <div id="listSection"></div>
      <div id="formSection"></div>

      <button id="logoutBtn"></button>
      <div id="logoutModal" style="display:none;"></div>
      <button id="cancelLogout"></button>
      <button id="confirmLogout"></button>
    `;

    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".sidebar");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    const listTab = document.getElementById("listTab");
    const newProfileTab = document.getElementById("newProfileTab");
    const listSection = document.getElementById("listSection");
    const formSection = document.getElementById("formSection");

    function activateTab(tabToActivate) {
      listTab.classList.remove("active");
      newProfileTab.classList.remove("active");
      listSection.style.display = "none";
      formSection.style.display = "none";

      tabToActivate.classList.add("active");

      if (tabToActivate === listTab) {
        listSection.style.display = "block";
      } else if (tabToActivate === newProfileTab) {
        formSection.style.display = "block";
      }
    }

    listTab.click();

    listTab.addEventListener("click", () => activateTab(listTab));
    newProfileTab.addEventListener("click", () => activateTab(newProfileTab));

    document.getElementById("logoutBtn").addEventListener("click", () => {
      document.getElementById("logoutModal").style.display = "block";
    });

    document.getElementById("cancelLogout").addEventListener("click", () => {
      document.getElementById("logoutModal").style.display = "none";
    });
  });

  test("Toggle sidebar colapsa y expande", () => {
    const toggleBtn = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".sidebar");

    expect(sidebar.classList.contains("collapsed")).toBe(false);

    toggleBtn.click();
    expect(sidebar.classList.contains("collapsed")).toBe(true);

    toggleBtn.click();
    expect(sidebar.classList.contains("collapsed")).toBe(false);
  });

  test("Tabs activan secciones correctas", () => {
    const listTab = document.getElementById("listTab");
    const newProfileTab = document.getElementById("newProfileTab");
    const listSection = document.getElementById("listSection");
    const formSection = document.getElementById("formSection");

    expect(newProfileTab.classList).not.toContain("active");
    expect(listSection.style.display).toBe("");
    expect(formSection.style.display).toBe("");

    newProfileTab.click();
    expect(newProfileTab.classList).toContain("active");
    expect(listTab.classList).not.toContain("active");
    expect(formSection.style.display).toBe("block");
    expect(listSection.style.display).toBe("none");

    listTab.click();
    expect(listTab.classList).toContain("active");
    expect(newProfileTab.classList).not.toContain("active");
    expect(listSection.style.display).toBe("block");
    expect(formSection.style.display).toBe("none");
  });

  test("Logout modal muestra y oculta correctamente", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const cancelLogout = document.getElementById("cancelLogout");
    const logoutModal = document.getElementById("logoutModal");

    expect(logoutModal.style.display).toBe("none");

    logoutBtn.click();
    expect(logoutModal.style.display).toBe("block");

    cancelLogout.click();
    expect(logoutModal.style.display).toBe("none");
  });

  test("Confirm logout redirige a logout.php", () => {    

    const confirmLogout = document.getElementById("confirmLogout");
    confirmLogout.click();

    expect(window.location.href).toBe("http://localhost/");
  });
});
