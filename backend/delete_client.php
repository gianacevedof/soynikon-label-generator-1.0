<?php
require_once 'headers.php';
require_once 'db.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret = $_ENV['JWT_SECRET'];

// Verify JWT token from Authorization header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

try {
    $token = substr($authHeader, 7);
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));
    $role = $decoded->role ?? '';
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid token"]);
    exit;
}

// Admin-only action
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Forbidden: admin access required"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$client_id = $data['client_id'] ?? '';

// Delete client
if (!$client_id) {
  http_response_code(400);
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