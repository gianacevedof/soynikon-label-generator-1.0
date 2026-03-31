<?php
header("Content-Type: application/json");
require 'db.php';

$client_id = $_POST['client_id'] ?? null;
$item_id = $_POST['item_id'] ?? null;
$shipping_date = $_POST['shipping_date'] ?? null;

if (!$client_id || !$shipping_date) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$placeholder = "temp";
$stmt = $conn->prepare("INSERT INTO orders (order_num, client_id, item_id, shipping_date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("siis", $placeholder, $client_id, $item_id, $shipping_date);

if ($stmt->execute()) {
    $order_id = $conn->insert_id;
    $order_num = str_pad($order_id, 5, "0", STR_PAD_LEFT);
    
    $update = $conn->prepare("UPDATE orders SET order_num = ? WHERE order_id = ?");
    $update->bind_param("si", $order_num, $order_id);
    $update->execute();
    
    echo json_encode(["success" => true, "order_id" => $order_num]);
} else {
    echo json_encode(["success" => false, "message" => "Error saving order"]);
}

$stmt->close();
$conn->close();
?>