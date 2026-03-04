document.addEventListener("DOMContentLoaded", () => {
  const selectedClientId = localStorage.getItem("selectedClientId");

  console.log("Valor de selectedClientId al cargar:", selectedClientId);

  if (selectedClientId) {
    localStorage.removeItem("selectedClientId");
    fetchClientData(selectedClientId);
  }

  // TAKING INPUT FROM RUTA
  const rutaInput = document.getElementById("form-ruta");
  const rutaPrint = document.getElementById("label-ruta-p");
  const rutaPreview = document.getElementById("label-ruta");

  if (rutaInput) {
    rutaInput.addEventListener("input", (event) => {
      const rutaTexto = event.target.value;
      const textoCompleto = "RUTA: " + rutaTexto.toUpperCase();

      rutaPreview.textContent = textoCompleto;

      if (rutaPrint) {
        rutaPrint.textContent = textoCompleto;
      }
    });
  }

  // TAKING INPUT FROM ITEM
  const itemInput = document.getElementById("form-item");
  const itemPrint = document.getElementById("label-item-p");
  const itemPreview = document.getElementById("label-item");

  if (itemInput) {
    itemInput.addEventListener("input", (event) => {
      const itemTexto = event.target.value;
      const textoCompleto = "ARTÍCULO: " + itemTexto.toUpperCase();

      itemPreview.textContent = textoCompleto;

      if (itemPrint) {
        itemPrint.textContent = textoCompleto;
      }
    });
  }

  // GETTING ACTUAL DATE
  const today = new Date();

  const dateString = today.toLocaleDateString("es-DO");

  const dateText = "FECHA: " + dateString;

  const datePreview = document.getElementById("label-date");
  const datePrint = document.getElementById("label-date-p");

  if (datePreview) {
    datePreview.textContent = dateText;
  }
  if (datePrint) {
    datePrint.textContent = dateText;
  }

  // SEARCH BAR LOGIC
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const query = event.target.value;

      if (query.length < 1) {
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";
        return;
      }

      fetch(`../backend/search_clients.php?q=${query}`)
        .then((response) => {
          return response.json();
        })
        .then((clients) => {
          if (clients.error) {
            console.error("Error del servidor de búsqueda:", clients.error);
            return;
          }

          renderSearchResults(clients);
        })
        .catch((error) => {
          console.error("Error al obtener datos de búsqueda:", error);
        });
    });
  }

  function renderSearchResults(clients) {
    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (clients.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }

    resultsContainer.style.display = "block";

    clients.forEach((client) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-item";

      resultItem.innerHTML = `
        <h3>${client.first_name} ${client.last_name}</h3>
        <p><strong>Teléfono:</strong> ${client.phone_number}</p>
        <p><strong>Ciudad:</strong> ${client.city}</p>
      `;

      resultItem.addEventListener("click", () => {
        displayClientData(client);
        resultsContainer.style.display = "none";
      });

      resultsContainer.appendChild(resultItem);
    });
  }
});

function fetchClientData(clientId) {
  fetch(`../backend/get_client_by_id.php?id=${clientId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        displayClientData(data.client);
      } else {
        console.error("Error del servidor:", data.message);
        alert("Error: Cliente no encontrado o ID inválido.");
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos del cliente:", error);
    });
}

function displayClientData(client) {
  document.getElementById("client-name").value =
    client.first_name + " " + client.last_name;
  document.getElementById("recipient-name").textContent =
    client.first_name + " " + client.last_name;
  document.getElementById("recipient-name-p").textContent =
    client.first_name + " " + client.last_name;

  document.getElementById("form-phone-number").value = client.phone_number;
  document.getElementById("recipient-phone-number").textContent =
    client.phone_number;
  document.getElementById("recipient-phone-number-p").textContent =
    client.phone_number;

  document.getElementById("form-city").value = client.city;
  document.getElementById("recipient-city").textContent = client.city;
  document.getElementById("recipient-city-p").textContent = client.city;
}
