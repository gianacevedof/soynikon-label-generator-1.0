document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("search-results");

    // Label preview elements
    const previewName = document.getElementById("ship-to");
    const previewAddress = document.getElementById("ship-address");

    searchInput.addEventListener("input", (event) => {
        const query = event.target.value.trim();

        if (query.length < 1) {
            resultsContainer.innerHTML = "";
            resultsContainer.style.display = "none";
            return;
        }

        fetch(`../backend/search_clients.php?q=${query}`)
            .then(response => response.json())
            .then(clients => {
                renderResults(clients);
            })
            .catch(err => console.error("Search error:", err));
    });

    function renderResults(clients) {
        resultsContainer.innerHTML = "";
        if (clients.length === 0) {
            resultsContainer.style.display = "none";
            return;
        }

        resultsContainer.style.display = "block";
        clients.forEach(client => {
            const div = document.createElement("div");
            div.className = "search-item p-2 border-bottom";
            div.style.cursor = "pointer";
            div.innerHTML = `<strong>${client.first_name} ${client.last_name}</strong> - ${client.city}`;

            div.addEventListener("click", () => {
                // Fill preview with client's data
                previewName.textContent = `${client.first_name} ${client.last_name}`;
                
                // Reset address (Address 1, City, State Zip)
                previewAddress.innerHTML = `
                    ${client.address_1} ${client.address_2 ? '<br>' + client.address_2 : ''}<br>
                    ${client.city}, ${client.state} ${client.zip}
                `;

                resultsContainer.style.display = "none";
                searchInput.value = ""; 
            });

            resultsContainer.appendChild(div);
        });
    }
});