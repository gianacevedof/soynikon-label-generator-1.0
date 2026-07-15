<?php
    require_once 'headers.php';
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    require_once 'db.php';
    use Firebase\JWT\JWT;

    // Receiving POST values
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    // Validate empty fields
    if (!$username || !$password) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    // Query users table
    $stmt = $conn->prepare("SELECT user_id, username, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // Verify password
    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
        exit;
    }

    $secret = $_ENV['JWT_SECRET'];

    $payload = [
        'iat' => time(),
        'exp' => time() + (86400 * 7),
        'user_id' => $user['user_id'],
        'username' => $user['username'],
        'role' => $user['role']
    ];

    $token = JWT::encode($payload, $secret, 'HS256');
    echo json_encode(["success" => true, "token" => $token, "role" => $user['role']]);
?>