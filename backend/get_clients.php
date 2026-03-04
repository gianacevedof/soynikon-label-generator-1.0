<?php 
require_once 'db.php';

// Prepare query
$sql = "select * from clients";
$result = $conn->query($sql);

// If there are results
$clients = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $clients[] = $row;
    }
}

// Send JSON response
header('Content-Type: application/json');
echo json_encode([
    "success" => true,
    "data" => $clients]);
    $conn->close();
?>