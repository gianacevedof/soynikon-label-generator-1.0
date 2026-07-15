<?php
require_once 'headers.php';
require 'db.php';

$itemName = $_POST['item_name'] ?? '';

if (empty($itemName)) {
    echo json_encode(["success" => false, "message" => "Vacío"]);
    exit;
}

try {
    $checkSql = "SELECT item_id FROM items WHERE item = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("s", $itemName);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows > 0) {
        $row = $resCheck->fetch_assoc();
        echo json_encode(["success" => true, "message" => "Item already exists.", "item_id" => $row['item_id']]);
    } else {
        $sql = "INSERT INTO items (item) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        $newId = $conn->insert_id;
        echo json_encode(["success" => true, "message" => "New item saved.", "item_id" => $newId]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>