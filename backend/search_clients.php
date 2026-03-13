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

        $sql = "SELECT c.*, ci.city, s.state 
                FROM clients c
                JOIN cities ci ON c.city_id = ci.city_id
                JOIN states s ON ci.state_id = s.state_id
                WHERE c.first_name LIKE ? 
                   OR c.last_name LIKE ? 
                   OR c.phone LIKE ? 
                   OR ci.city LIKE ? 
                   OR s.state LIKE ?";
        
        $stmt = $conn->prepare($sql);

        $stmt->bind_param("sssss", $search_term, $search_term, $search_term, $search_term, $search_term);
        $stmt->execute();

        $result = $stmt->get_result();
        $clients = [];
        while ($row = $result->fetch_assoc()) {
            $clients[] = $row;
        }

        $stmt->close();
        echo json_encode($clients);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Server error: '. $e->getMessage()]);
    }

    $conn->close();
?>