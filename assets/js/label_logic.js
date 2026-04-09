document.addEventListener("DOMContentLoaded", () => {
  // Client elements
  const searchInput = document.getElementById("search");
  const resultsContainer = document.getElementById("search-results");
  const previewName = document.getElementById("ship-to");
  const previewAddress = document.getElementById("ship-address");
  let selectedClientId = null;

  // Item elements
  const itemInput = document.getElementById("item-search-bar");
  const itemResults = document.getElementById("item-results");
  const previewItem = document.getElementById("order-item");
  const btnTemplate = document.getElementById("template");
  const orderNumber = document.getElementById("order-number");
  let selectedItemId = null;

  // Get actual date MM-DD-YYYY
  const previewDate = document.getElementById("shipping-date");
  const today = new Date();
  const formattedDate =
    (today.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    today.getDate().toString().padStart(2, "0") +
    "-" +
    today.getFullYear();
  if (previewDate) {
    previewDate.textContent = `Shipping Date: ${formattedDate}`;
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
        .then((response) => response.json())
        .then((clients) => {
          renderResults(clients);
        })
        .catch((err) => console.error("Search error:", err));
    });
  }

  function renderResults(clients) {
    resultsContainer.innerHTML = "";
    if (clients.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }

    resultsContainer.style.display = "block";
    clients.forEach((client) => {
      const div = document.createElement("div");
      div.className = "search-item p-2 border-bottom";
      div.style.cursor = "pointer";
      div.innerHTML = `<strong>${client.first_name} ${client.last_name}</strong> - ${client.city}`;

      div.addEventListener("click", () => {
        selectedClientId = client.client_id;
        previewName.textContent = `${client.first_name} ${client.last_name}`;
        previewAddress.innerHTML = `
                    ${client.address_1} ${client.address_2 ? "<br>" + client.address_2 : ""}<br>
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
        .then((res) => res.json())
        .then((items) => {
          renderItemResults(items);
        })
        .catch((err) => console.error("Item search error:", err));
    });
  }

  function renderItemResults(items) {
    itemResults.innerHTML = "";
    if (items.length === 0) {
      itemResults.style.display = "none";
      return;
    }

    itemResults.style.display = "block";
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "search-item p-2 border-bottom";
      div.style.cursor = "pointer";
      div.textContent = item.item;

      div.addEventListener("click", () => {
        selectedItemId = item.item_id;
        previewItem.textContent = `Item: ${item.item}`;
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
      previewItem.textContent = `Item: ${itemName}`;

      // 2. Send to backend to save item
      const formData = new FormData();
      formData.append("item_name", itemName);

      fetch("backend/save_item.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("Server response:", data.message);
          }
        })
        .catch((err) => console.error("Error while trying to save item:", err));
    });
  }

  // Generate print-version label
  const generateBtn = document.getElementById("generate-btn");
  generateBtn.addEventListener("click", () => {
    if (!previewName.textContent || !itemResults.innerHTML) {
      window.alert("Error: Please select a client and an item");
      console.log("Clicked");
    } else {
      // Save order first, then generate PDF
      const formData = new FormData();
      formData.append("client_id", selectedClientId);
      formData.append("item_id", selectedItemId);
      formData.append("shipping_date", new Date().toISOString().split("T")[0]);

      fetch("backend/save_order.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const orderNumber = data.order_id;
            console.log("Order saved:", orderNumber);

            // Generate PDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ unit: "in", format: [4, 6] });

            const stripHTML = (html) => {
              const temp = document.createElement("div");
              temp.innerHTML = html;
              return temp.innerText;
            };

            const name = previewName.textContent.trim();
            const address = stripHTML(previewAddress.innerHTML).trim();
            const item = previewItem.textContent.trim();
            const date = previewDate.textContent.trim();

            const d0 = 0;
            const d1 = 1.3;
            const d2 = 2.9;
            const d3 = 4.2;

            // Section centers
            const sec1Center = (d0 + d1) / 2;
            const sec3Center = (d2 + d3) / 2;

            doc.setDrawColor(180);
            doc.setLineWidth(0.005);

            // ORDER DETAILS
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("ORDER DETAILS", 0.3, d0 + 0.3);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(date, 0.3, d1 - 0.15);
            doc.text(item, 0.3, d1 - 0.35);
            doc.text(`Order #: ${orderNumber}`, 0.3, d1 - 0.55);

            // Logo
            const logoH = 0.75;
            const logoW = 0.9;
            const logoY = sec1Center - logoH / 2;
            try {
              doc.addImage(
                "https://web.soynikon.do/assets/images/logo-1-print.jpeg",
                "JPEG",
                2.8,
                logoY,
                logoW,
                logoH,
              );
            } catch (e) {
              console.log("Logo not loaded:", e);
            }

            // Divider 1
            doc.line(0.3, d1, 3.7, d1);

            // SHIP TO
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("SHIP TO:", 0.3, d1 + 0.3);

            const addressLines = address
              .split("\n")
              .filter((l) => l.trim() !== "");
            const totalAddressLines = addressLines.length;
            const bottomY = d2 - 0.15;

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(name, 0.3, bottomY - totalAddressLines * 0.2 - 0.15);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            let addrY = bottomY - (totalAddressLines - 1) * 0.2;
            addressLines.forEach((line) => {
              doc.text(line.trim(), 0.3, addrY);
              addrY += 0.2;
            });

            // Divider 2
            doc.line(0.3, d2, 3.7, d2);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("FROM:", 0.3, d2 + 0.3);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text("Orlando, FL 56789", 0.3, d3 - 0.15);
            doc.text("1234 Envio St.", 0.3, d3 - 0.35);
            doc.text("Soynikon Photo Store", 0.3, d3 - 0.55);

            // Fragile icon
            const fragileH = 0.8;
            const fragileW = 0.85;
            const fragileY = sec3Center - fragileH / 2;
            try {
              doc.addImage(
                "https://web.soynikon.do/assets/images/fragile.png",
                "PNG",
                2.85,
                fragileY,
                fragileW,
                fragileH,
              );
            } catch (e) {
              console.log("Fragile not loaded:", e);
            }

            // Divider 3
            doc.line(0.3, d3, 3.7, d3);

            // NOTE
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("NOTE:", 0.3, d3 + 0.3);

            doc.save("soynikon-desk-label.pdf");
          } else {
            alert("Error saving order: " + data.message);
          }
        })
        .catch((err) => console.error("Error:", err));
    }
  });

  // Reset btn
  document.getElementById("reset-btn").onclick = function () {
    orderNumber.innerHTML = `<p id="order-item">Order #:</p>`;
    previewItem.innerHTML = `<p id="order-item">Item:</p>`;
    previewName.textContent = "";
    previewAddress.textContent = "";
  };
});
