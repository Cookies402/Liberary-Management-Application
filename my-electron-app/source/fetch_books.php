<?php
// Replace these variables with your MySQL database credentials
$servername = "localhost";
$username = "root";
$password = "Dimpu92126!!";
$database = "lma_db";
$table = "book_list";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch book data
$sql = "SELECT `A_no`, `Author`, `Title`, `No_of_pages`, `Publisher`, `Date_of_purchase` FROM `$table`";
$result = $conn->query($sql);

if ($result === false) {
    die("Error executing query: " . $conn->error);
}

if ($result->num_rows > 0) {
    // Store fetched data in an array
    $books = array();
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }

    // Convert array to JSON and output
    echo json_encode($books);
} else {
    echo json_encode(array()); // Return an empty array if no records found
}

// Close connection
$conn->close();
?>
