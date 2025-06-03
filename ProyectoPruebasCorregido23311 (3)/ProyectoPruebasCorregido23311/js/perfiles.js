let isEditing = false;

function showMessage(type, message) {
  const messageBox = document.createElement("div");
  messageBox.className = `message ${type}`;
  messageBox.textContent = message;
  const container = document.getElementById("messageContainer");
  if (container) {
    container.appendChild(messageBox);
    setTimeout(() => {
      messageBox.style.opacity = 0;
      setTimeout(() => {
        if (messageBox.parentNode) {
          messageBox.parentNode.removeChild(messageBox);
        }
      }, 300);
    }, 3000);
  }
}

function resetEditState() {
  const formSection1 = document.getElementById("formSection1");
  const userTable = document.getElementById("userTable");
  if (formSection1) formSection1.style.display = "none";
  if (userTable) userTable.style.display = "block";
  isEditing = false;
}

function toggleSections(showForm) {
  const formSection = document.getElementById("formSection");
  const listSection = document.getElementById("listSection");
  if (formSection && listSection) {
    formSection.style.display = showForm ? "block" : "none";
    listSection.style.display = showForm ? "none" : "block";
  }
}

function loadUserTable() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "fetch_users.php", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const userTable = document.getElementById("userTable");
      if (userTable) {
        userTable.innerHTML = xhr.responseText;
        addActionListeners();
      }
    }
  };
  xhr.send();
}

function handleActivation(button, url) {
  button.addEventListener("click", function() {
    const id = this.getAttribute("data-id");
    const tipo = this.getAttribute("data-tipo");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        showMessage(response.status, response.message);
        loadUserTable();
      } else {
        showMessage("error", "Error en la conexión con el servidor");
      }
    };
    xhr.send("id=" + encodeURIComponent(id) + "&tipo=" + encodeURIComponent(tipo));
  });
}

function addActionListeners() {
  document.querySelectorAll(".btn-activate").forEach(button => {
    handleActivation(button, "activar.php");
  });
  document.querySelectorAll(".btn-deactivate").forEach(button => {
    handleActivation(button, "eliminar.php");
  });
  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      loadEditForm(id);
    });
  });
}

function loadEditForm(id) {
  isEditing = true;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "editar/get_users.php?id=" + encodeURIComponent(id), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const formSection1 = document.getElementById("formSection1");
      const userTable = document.getElementById("userTable");
      if (formSection1 && userTable) {
        formSection1.innerHTML = xhr.responseText;
        formSection1.style.display = "block";
        userTable.style.display = "none";
      }
      const editForm = document.getElementById("editForm");
      if (editForm) {
        editForm.addEventListener("submit", function(event) {
          event.preventDefault();
          const formData = new FormData(editForm);
          const xhrSubmit = new XMLHttpRequest();
          xhrSubmit.open("POST", editForm.action, true);
          xhrSubmit.onload = function() {
            if (xhrSubmit.status === 200) {
              const response = JSON.parse(xhrSubmit.responseText);
              showMessage(response.status, response.message);
              loadUserTable();
              resetEditState();
            } else {
              showMessage("error", "Error al actualizar el usuario");
            }
          };
          xhrSubmit.send(formData);
        });
      }
    } else {
      showMessage("error", "Error al cargar el formulario de edición");
    }
  };
  xhr.send();
}

function initializePageLogic() {
  // Lógica del perfil
  const perfilInput = document.getElementById("perfil");
  if (perfilInput) {
    perfilInput.addEventListener("input", function() {
      const perfil = this.value.toLowerCase();
      const permissions = {
        "administrador": ["Inicio", "Asignar", "Cliente", "Ventas", "Productos", "Servicios", "Proveedores", "Reportes"],
        "ventas": ["Inicio", "Cliente", "Ventas", "Reportes"],
        "bodega": ["Inicio", "Productos", "Servicios", "Proveedores", "Reportes"]
      };
      const checkboxes = document.querySelectorAll("input[name=\"permisos[]\"]");
      const permissoesParaPerfil = permissions[perfil] || [];
      checkboxes.forEach(checkbox => {
        checkbox.checked = permissoesParaPerfil.includes(checkbox.value);
      });
    });
  }

  // Form submit
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      const formData = new FormData(form);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "save.php", true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.status === "success") {
            showMessage("success", response.message);
            form.reset();
          } else {
            showMessage("error", response.message);
          }
        } else {
          showMessage("success", "Perfil guardado correctamente");
        }
      };
      xhr.send(formData);
    });
  }

  // Tabs
  const newProfileTab = document.getElementById("newProfileTab");
  if (newProfileTab) {
    newProfileTab.addEventListener("click", function() {
      if (isEditing) resetEditState();
      toggleSections(true);
    });
  }

  const listTab = document.getElementById("listTab");
  if (listTab) {
    listTab.addEventListener("click", function() {
      if (isEditing) resetEditState();
      toggleSections(false);
      loadUserTable();
    });
  }
}

// Exporta funciones para Jest si está en Node
/* eslint-disable no-undef */
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = {
    showMessage,
    resetEditState,
    toggleSections,
    loadUserTable,
    addActionListeners,
    loadEditForm,
    isEditing,
    initializePageLogic,
  };
}
/* eslint-enable no-undef */

if (typeof window !== "undefined" && typeof document !== "undefined") {
  initializePageLogic();
}
