<?php
require_once 'headers.php';
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$client_id = $data['client_id'] ?? '';
$first_name = $data['first_name'] ?? '';
$last_name = $data['last_name'] ?? '';
$phone = $data['phone'] ?? '';
$address_1 = $data['address_1'] ?? '';
$address_2 = $data['address_2'] ?? '';
$city = $data['city'] ?? '';
$state = $data['state'] ?? '';
$zip = $data['zip'] ?? '';

// Validate empty fields
if (!$client_id || !$first_name || !$address_1 || !$city || !$state || !$zip) {
  echo json_encode(["success" => false, "message" => "Missing required fields"]);
  exit;
}

// Get state / Insert state if doesn't exist
$sql_get = "SELECT state_id FROM states WHERE state = ?";
$stmt = $conn->prepare($sql_get);
$stmt->bind_param("s", $state);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $state_id = $row['state_id'];
} else {
    $sql_insert = "INSERT INTO states (state) VALUES (?)";
    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("s", $state);
    $stmt->execute();
    $state_id = $conn->insert_id;
}

// Get city / Insert city if doesn't exist
$sql_get = "SELECT city_id FROM cities WHERE city = ? AND state_id = ?";
$stmt = $conn->prepare($sql_get);
$stmt->bind_param("si", $city, $state_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $city_id = $row['city_id'];
} else {
    $sql_insert = "INSERT INTO cities (city, state_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql_insert);
    $stmt->bind_param("si", $city, $state_id);
    $stmt->execute();
    $city_id = $conn->insert_id;
}

// Update client data
if (empty($city_id)) {
    echo json_encode(["success" => false, "message" => "The city can't be determinated"]);
    exit;
}
$stmt = $conn->prepare(
    "UPDATE clients SET
    first_name = ?, last_name = ?, phone = ?, address_1 = ?, address_2 = ?, zip = ?, city_id = ? WHERE client_id = ?"
);
$stmt->bind_param("ssssssii", $first_name, $last_name, $phone, $address_1, $address_2, $zip, $city_id, $client_id);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Client updated"]);
} else {
    echo json_encode(["success" => false, "message" => "Error while updating client"]);
}

$stmt->close();
$conn->close();
?>