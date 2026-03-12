<?php 
require_once 'db.php';

// Prepare query
$sql = "SELECT 
            c.client_id, 
            c.first_name, 
            c.last_name, 
            c.phone, 
            c.address_1,
            c.address_2,
            c.zip,
            ci.city, 
            s.state 
        FROM clients c
        JOIN cities ci ON c.city_id = ci.city_id
        JOIN states s ON ci.state_id = s.state_id
        ORDER BY c.client_id ASC";

$result = $conn->query($sql);
$clients = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $clients[] = $row;
    }
}

echo json_encode($clients);
$conn->close();
?>