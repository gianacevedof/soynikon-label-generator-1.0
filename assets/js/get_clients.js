function selectClient(clientId) {
  localStorage.setItem("selectedClientId", clientId);
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("../backend/get_clients.php")
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("No es una respuesta JSON válida.");
      }
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("clients-container");
      const clients = data.data;

      if (!clients || clients.length === 0) {
        container.innerHTML = "<p>No hay clientes registrados.</p>";
        return;
      }

      let html = "";
      clients.forEach((client) => {
        html += `
          <div class="client-card" onclick="selectClient(${client.id})">
            <h3>${client.first_name} ${client.last_name}</h3>
            <p><strong>Número de Teléfono:</strong> ${client.phone_number}</p>
            <p><strong>Ciudad:</strong> ${client.city}</p>
          </div>
        `;
      });
      container.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error al cargar los clientes:", error);
      document.getElementById("clients-container").innerHTML =
        "<p>Hubo un error al conectar con el servidor.</p>";
    });
});
