<?php
    require_once 'headers.php';
    require_once 'db.php';

    // Receiving POST values
    $data = json_decode(file_get_contents('php://input'), true);

    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // Validate empty fields
    if (!$username || !$password) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    // Validate user is not already registered
    $sql_get = "SELECT username FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql_get);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0)
    {
        echo json_encode(["success" => false, "message" => "User already exists"]);
        exit;
    }

    // Hash password
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // Insert user data w/ prepared statements
    $role = "standard";
    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $hashed, $role);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User registered"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error while registering user"]);
    }
?>