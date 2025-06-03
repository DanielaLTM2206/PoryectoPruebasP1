let isEditing = false;

function toggleSections(showForm) {
  document.getElementById("formSection").style.display = showForm ? "block" : "none";
  document.getElementById("listSection").style.display = showForm ? "none" : "block";
}

function resetEditState() {
  document.getElementById("formSection1").style.display = "none";
  document.getElementById("userTable").style.display = "block";
  isEditing = false;
}

function sendPostRequest(url, params, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    callback(xhr);
  };
  xhr.send(params);
}

function loadUserTable(tipo) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "fetch_users.php?tipo=" + encodeURIComponent(tipo), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      document.getElementById("userTable").innerHTML = xhr.responseText;
      addActionListeners();
    }
  };
  xhr.send();
}

function handleActivation(button, url, tipo) {
  button.addEventListener("click", function() {
    const id = this.getAttribute("data-id");
    sendPostRequest(url, "id=" + encodeURIComponent(id) + "&tipo=" + encodeURIComponent(tipo), function(xhr) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        showMessage(response.status, response.message);
        loadUserTable(tipo);
      } else {
        showMessage("error", "Error en la conexión con el servidor");
      }
    });
  });
}

function addActionListeners() {
  const tipo = "proveedores";
  document.querySelectorAll(".btn-activate").forEach(button => {
    handleActivation(button, "activar.php", tipo);
  });
  document.querySelectorAll(".btn-deactivate").forEach(button => {
    handleActivation(button, "eliminar.php", tipo);
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
  xhr.open("GET", "editar/edit_proveedor.php?id=" + encodeURIComponent(id), true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      document.getElementById("formSection1").innerHTML = xhr.responseText;
      document.getElementById("formSection1").style.display = "block";
      document.getElementById("userTable").style.display = "none";

      const editForm = document.getElementById("editForm");
      editForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(editForm);
        const xhrSubmit = new XMLHttpRequest();
        xhrSubmit.open("POST", editForm.action, true);
        xhrSubmit.onload = function() {
          if (xhrSubmit.status === 200) {
            const response = JSON.parse(xhrSubmit.responseText);
            showMessage(response.status, response.message);
            loadUserTable("proveedores");
            resetEditState();
          } else {
            showMessage("error", "Error al actualizar el usuario");
          }
        };
        xhrSubmit.send(formData);
      });
    } else {
      showMessage("error", "Error al cargar el formulario de edición");
    }
  };
  xhr.send();
}

function showMessage(type, message) {
  const messageBox = document.createElement("div");
  messageBox.className = `message ${type}`;
  messageBox.textContent = message;
  document.getElementById("messageContainer").appendChild(messageBox);

  setTimeout(function() {
    messageBox.style.opacity = 0;
    setTimeout(function() {
      if (messageBox.parentNode) {
        messageBox.parentNode.removeChild(messageBox);
      }
    }, 300);
  }, 3000);
}

function handleFormSubmit(form) {
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
        showMessage("success", "Proveedor guardado correctamente");
      }
    };
    const formData = new FormData(form);
    const params = new URLSearchParams(formData).toString();
    xhr.send(params);
  });
}

document.getElementById("newProfileTab").addEventListener("click", function() {
  if (isEditing) resetEditState();
  toggleSections(true);
});

document.getElementById("listTab").addEventListener("click", function() {
  if (isEditing) resetEditState();
  toggleSections(false);
  loadUserTable("proveedores");
});

const form = document.querySelector("form");
if (form) {
  handleFormSubmit(form);
}
