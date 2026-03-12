document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('tbody');

    fetch('backend/get_clients.php')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            
            data.forEach(client => {
                const row = `
                    <tr>
                        <th>${client.client_id}</th>
                        <td>${client.first_name}</td>
                        <td>${client.last_name || '-'}</td>
                        <td>${client.phone || '-'}</td>
                        <td>${client.address_1}</td>
                        <td>${client.address_2 || '-'}</td>
                        <td>${client.city}</td>
                        <td>${client.state}</td>
                        <td>${client.zip}</td>
                        <td>
                          <a href="#" class="btn"><i class="fa-solid fa-pen-to-square"></i></a>
                          <a href="#" class="btn"><i class="fa-solid fa-trash"></i></a>
                        </td>
                    </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Error loading clients:', error));
});