<?php
require_once 'headers.php';
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$client_id = $data['client_id'] ?? '';

// Delete client
if (!$client_id) {
  echo json_encode(["success" => false, "message" => "Missing client ID"]);
  exit;
}
$stmt = $conn->prepare("DELETE FROM clients WHERE client_id = ?");
$stmt->bind_param("i", $client_id);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Client deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Error while deleting client"]);
}

$stmt->close();
$conn->close();
?>