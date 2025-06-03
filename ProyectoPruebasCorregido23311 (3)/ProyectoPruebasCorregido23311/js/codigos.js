document.addEventListener("DOMContentLoaded", () => {
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
}); 

// Funcionalidad de cerrar sesión
document.getElementById("logoutBtn").addEventListener("click", function() {
  document.getElementById("logoutModal").style.display = "block";
});

document.getElementById("cancelLogout").addEventListener("click", function() {
  document.getElementById("logoutModal").style.display = "none";
});

document.getElementById("confirmLogout").addEventListener("click", function() {
  window.location.href = "logout.php";
});

