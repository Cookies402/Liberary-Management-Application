<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "Dimpu92126!!";
$database = "lma_db";
$table = "book_list";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

$a_no = $_POST['a_no'];
$author = $_POST['author'];
$title = $_POST['title'];
$no_of_pages = $_POST['no_of_pages'];
$publisher = $_POST['publisher'];
$date_of_purchase = $_POST['date_of_purchase'];

$sql = "UPDATE $table SET Author = ?, Title = ?, No_of_pages = ?, Publisher = ?, Date_of_purchase = ? WHERE A_no = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssissi", $author, $title, $no_of_pages, $publisher, $date_of_purchase, $a_no);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
