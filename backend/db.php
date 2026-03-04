<?php
$host = 'localhost';
$user = 'yardus_soynikon';
$pass = 'F2JmiksF6C@q7G4';
$dbname = 'yardus_soynikon';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>