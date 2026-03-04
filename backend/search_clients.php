<?php
    header("Content-Type: application/json");
    require 'db.php';

    $query = isset($_GET['q']) ? $_GET['q'] : '';

    if (strlen($query) < 1) {
        echo json_encode([]);
        exit;
    }

    try {
        $search_term = "%" . $query . "%";

        $sql = "select * from clients where first_name like ? or last_name like ? or phone_number like ? or city like ? limit 10";
        
        $stmt = $conn->prepare($sql);

        $stmt->bind_param("ssss", $search_term, $search_term, $search_term, $search_term);
        $stmt->execute();

        $result = $stmt->get_result();
        $clients = [];
        while ($row = $result->fetch_assoc()) {
            $clients[] = $row;
        }

        $stmt->close();

        echo json_encode($clients);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Error de servidor: '. $e->getMessage()]);
    }

    $conn->close();
?>