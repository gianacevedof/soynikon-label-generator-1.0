<?php
header("Content-Type: application/json");
require 'db.php';

$itemName = $_POST['item_name'] ?? '';

if (empty($itemName)) {
    echo json_encode(["success" => false, "message" => "Vacío"]);
    exit;
}

try {
    // 1. Verify if item exists
    $checkSql = "SELECT item_id FROM items WHERE item = ?";
    $stmtCheck = $conn->prepare($checkSql);
    $stmtCheck->bind_param("s", $itemName);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if ($resCheck->num_rows > 0) {
        // If exists: do nothing
        echo json_encode(["success" => true, "message" => "Item ya existe, no se duplicó."]);
    } else {
        // 2. If does not exist: insert it
        $sql = "INSERT INTO items (item) VALUES (?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $itemName);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Nuevo item guardado."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
$conn->close();
?>