<?php 
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    require 'db.php';

    $client_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($client_id === 0) {
        echo json_encode(['error' => 'ID de cliente no proporcionado o inválido.']);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT id, first_name, last_name, city, phone_number FROM clients WHERE id = ?");

        if ($stmt === false) {
            throw new Exception("Error en la preparación de la consulta: " . $conn->error);
        }

        $stmt->bind_param('i', $client_id); 
        
        $stmt->execute();

        $result = $stmt->get_result();
        
        $client = $result->fetch_assoc();

        $stmt->close();

        if ($client) {
            echo json_encode(['success' => true, 'client' => $client]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Cliente no encontrado.']);
        }
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
    }
    $conn->close();
?>