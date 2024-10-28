<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "test_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$action = $_GET['action'] ?? '';

if ($action == 'list') {
    $page = $_GET['page'] ?? 1;
    $limit = 10;
    $offset = ($page - 1) * $limit;

    $search = $_GET['search'] ?? '';
    $searchCondition = $search ? "WHERE full_name LIKE '%$search%' OR dni LIKE '%$search%'" : '';

    $sql = "SELECT * FROM users $searchCondition LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode($users);
}

if ($action == 'update') {
    $id = $_POST['id'];
    $dni = $_POST['dni'];
    $full_name = $_POST['full_name'];
    $birth_date = $_POST['birth_date'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    $sql = "UPDATE users SET dni='$dni', full_name='$full_name', birth_date='$birth_date', phone='$phone', email='$email' WHERE id=$id";
    $conn->query($sql);
    echo json_encode(["success" => true]);
}

if ($action == 'create') {
    $dni = $_POST['dni'];
    $full_name = $_POST['full_name'];
    $birth_date = $_POST['birth_date'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    $sql = "INSERT INTO users (dni, full_name, birth_date, phone, email) VALUES ('$dni', '$full_name', '$birth_date', '$phone', '$email')";
    $conn->query($sql);
    echo json_encode(["success" => true, "id" => $conn->insert_id]);
}

$conn->close();
?>