<?php
require_once 'db.php';

// Set JSON header
header('Content-Type: application/json');

// Receiving POST values
$first_name   = $_POST['first_name']   ?? '';
$last_name    = $_POST['last_name']    ?? '';
$phone_number = $_POST['phone_number'] ?? '';
$city         = $_POST['city']         ?? '';

// 1. Validate empty fields
if (!$first_name || !$last_name || !$phone_number || !$city) {
    echo json_encode(["success" => false, "message" => "Missing information"]);
    exit;
}

// 2. Validate phone number (exactly 10 digits)
if (!preg_match('/^[0-9]{10}$/', $phone_number)) {
    echo json_encode(["success" => false, "message" => "Invalid phone number"]);
    exit;
}

// 3. Prepare statement
$stmt = $conn->prepare("INSERT INTO clients (first_name, last_name, phone_number, city) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssss", $first_name, $last_name, $phone_number, $city);

// 4. Execute
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Client added"]);
} else {
    echo json_encode(["success" => false, "message" => "Error while adding client"]);
}

$stmt->close();
$conn->close();
?>
