document.addEventListener('DOMContentLoaded', () => {
    // Client elements
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("search-results");
    const previewName = document.getElementById("ship-to");
    const previewAddress = document.getElementById("ship-address");

    // Item elements
    const itemInput = document.getElementById("item-search-bar");
    const itemResults = document.getElementById("item-results");
    const previewItem = document.getElementById("order-item");
    const btnTemplate = document.getElementById("template");

    // Get actual date MM-DD-YYYY
    const previewDate = document.getElementById("shipping-date");
    const today = new Date();
    const formattedDate = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                          today.getDate().toString().padStart(2, '0') + '-' + 
                          today.getFullYear();
    if (previewDate) {
        previewDate.textContent = `SHIPPING DATE: ${formattedDate}`;
    }

    // 'Search client' logic
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            const query = event.target.value.trim();

            if (query.length < 1) {
                resultsContainer.innerHTML = "";
                resultsContainer.style.display = "none";
                return;
            }

            fetch(`backend/search_clients.php?q=${query}`)
                .then(response => response.json())
                .then(clients => {
                    renderResults(clients);
                })
                .catch(err => console.error("Search error:", err));
        });
    }

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
                previewName.textContent = `${client.first_name} ${client.last_name}`;
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

    // 'Search item' logic
    if (itemInput) {
        itemInput.addEventListener("input", (e) => {
            const query = e.target.value.trim();

            if (query.length < 1) {
                itemResults.innerHTML = "";
                itemResults.style.display = "none";
                return;
            }

            fetch(`backend/search_items.php?q=${query}`)
                .then(res => res.json())
                .then(items => {
                    renderItemResults(items);
                })
                .catch(err => console.error("Item search error:", err));
        });
    }

    function renderItemResults(items) {
        itemResults.innerHTML = "";
        if (items.length === 0) {
            itemResults.style.display = "none";
            return;
        }

        itemResults.style.display = "block";
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "search-item p-2 border-bottom";
            div.style.cursor = "pointer";
            div.textContent = item.item; 

            div.addEventListener("click", () => {
                previewItem.textContent = `ITEM: ${item.item}`;
                itemInput.value = item.item;
                itemResults.style.display = "none";
            });

            itemResults.appendChild(div);
        });
    }

    // 'Add to template' button logic
    if (btnTemplate) {
        btnTemplate.addEventListener("click", (e) => {
            e.preventDefault();
            
            const itemName = itemInput.value.trim();
            if (itemName === "") return;

            // 1. Refresh preview
            previewItem.textContent = `ITEM: ${itemName}`;

            // 2. Send to backend to save item
            const formData = new FormData();
            formData.append('item_name', itemName);

            fetch('backend/save_item.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Server response:", data.message);
                }
            })
            .catch(err => console.error("Error while trying to save item:", err));
        });
    }
});