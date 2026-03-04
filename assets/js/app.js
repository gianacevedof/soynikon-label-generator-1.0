//Function to load clients
function loadClients() {
  fetch("../backend/get_clients.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("clientsTable");
      tbody.innerHTML = "";

      data.forEach((client) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client.id}</td>
            <td>${client.first_name}</td>
            <td>${client.last_name}</td>
            <td>${client.phone_number}</td>
            <td>${client.city}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((err) => console.error("Error while loading clients:", err));
}

window.onload = loadClients;
