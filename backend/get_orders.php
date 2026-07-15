<?php 
require_once 'headers.php';
require_once 'db.php';

// Prepare query
$sql = "SELECT 
            o.order_num,
            c.first_name,
            c.last_name,
            i.item,
            c.address_1,
            c.address_2,
            ci.city,
            s.state,
            c.zip,
            o.shipping_date
        FROM clients c
        JOIN orders o ON o.client_id = c.client_id
        JOIN items i ON i.item_id = o.item_id
        JOIN cities ci ON c.city_id = ci.city_id
        JOIN states s on ci.state_id = s.state_id";

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