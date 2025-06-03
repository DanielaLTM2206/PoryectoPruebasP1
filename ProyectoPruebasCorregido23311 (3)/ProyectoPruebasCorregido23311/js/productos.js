// Cargar proveedores en el select
const loadProviders = () => {
  fetch("fetch_providers.php")
    .then(response => response.text())
    .then(data => {
      document.getElementById("proveedor_producto").innerHTML = data;
    });
};
loadProviders();

// Mostrar mensajes flotantes
function showMessage(type, message) {
  const messageBox = document.createElement("div");
  messageBox.className = `message ${type}`;
  messageBox.textContent = message;
  document.getElementById("messageContainer").appendChild(messageBox);

  setTimeout(() => {
    messageBox.style.opacity = 0;
    setTimeout(() => {
      if (messageBox.parentNode) {
        messageBox.parentNode.removeChild(messageBox);
      }
    }, 300);
  }, 3000);
}

// Enviar formulario mediante AJAX
const form = document.getElementById("newProductForm");
form.addEventListener("submit", function(e) {
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open("POST", form.action, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        const response = JSON.parse(xhr.responseText);
        showMessage(response.status, response.message);
        if (response.status === "success") form.reset();
      } catch (error) {
        console.error("Error al parsear la respuesta del servidor:", error);
        showMessage("error", "Respuesta no válida del servidor");
      }
    } else {
      showMessage("success", "Producto guardado correctamente");
    }
  };
  const formData = new FormData(form);
  const params = new URLSearchParams(formData).toString();
  xhr.send(params);
});

let isEditing = false;

function resetEditState() {
  document.getElementById("formSection1").style.display = "none";
  document.getElementById("userTable").style.display = "block";
  isEditing = false;
}

function toggleSections(showForm) {
  document.getElementById("formSection").style.display = showForm ? "block" : "none";
  document.getElementById("listSection").style.display = showForm ? "none" : "block";
}

document.getElementById("newProfileTab").addEventListener("click", function() {
  if (isEditing) resetEditState();
  toggleSections(true);
});

document.getElementById("listTab").addEventListener("click", function() {
  if (isEditing) resetEditState();
  toggleSections(false);
  loadUserTable("productos");
});

// Cargar la tabla de usuarios mediante AJAX
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

function handleActivation(button, url, tipoTabla) {
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
        loadUserTable(tipoTabla);
      } else {
        showMessage("error", "Error en la conexión con el servidor");
      }
    };
    xhr.send("id=" + encodeURIComponent(id) + "&tipo=" + encodeURIComponent(tipo));
  });
}

function addActionListeners() {
  document.querySelectorAll(".btn-activate").forEach(button => {
    handleActivation(button, "activar.php", "productos");
  });
  document.querySelectorAll(".btn-deactivate").forEach(button => {
    handleActivation(button, "eliminar.php", "productos");
  });
  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      loadEditForm(id);
    });
  });
  document.querySelectorAll(".btn-add-product").forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-id");
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "add_product.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showMessage(response.status, response.message);
          loadUserTable("productos");
        } else {
          showMessage("error", "Error en la conexión con el servidor");
        }
      };
      xhr.send("id=" + encodeURIComponent(id));
    });
  });
}

function loadEditForm(id) {
  isEditing = true;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "editar/edit_product.php?id=" + encodeURIComponent(id), true);
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
            loadUserTable("productos");
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