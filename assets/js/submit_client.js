document.addEventListener('DOMContentLoaded', function() {
    const clientForm = document.querySelector('form[name="clients"]');
    
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch('../backend/add_client.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in the server (Status ' + response.status + ')');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Success: " + data.message);
                    this.reset();
                } else {
                    alert("There was a problem: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was a problem: " + error.message);
            });
        });
    }
});