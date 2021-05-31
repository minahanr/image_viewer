<?php
    session_start();
    $db_servername = "localhost";
    $db_username = "root";
    $db_password = "password123";
    $db_name = "image_viewer";

    $conn = mysqli_connect($db_servername, $db_username, $db_password, $db_name);
    
    if (mysqli_connect_errno()) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="styles.css" rel="stylesheet">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Source+Serif+Pro' rel='stylesheet' type='text/css'>
</head>

<body>
    <div class='box'>
        <div class='filters'>
            <form action='browser.php'method='POST'>
                <label for='name'>Name</label>
                <input type='text' id='name' name='name' value=''><br>
                <label for='modality'>Modality</label>
                <input type='text' id='modality' name='modality' value=''><br>
                <label for='subject'>Subject</label>
                <input type='text' id='subject' name='subject' value=''><br>
                <button id='submit-filters' name='submit-filters' type='submit'>Submit Filters</button>
            </form>
        </div>
        <div class='form-container'>
            <form action='add_images.php' class='add-images' method='POST'>
                <div class='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Modality</th>
                                <th>Subject</th>
                                <th>Format</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                                if (isset($_POST['submit-filters'])) {
                                    $name = mysqli_real_escape_string($conn, $_POST['name']);
                                    $modality = mysqli_real_escape_string($conn, $_POST['modality']);
                                    $subject = mysqli_real_escape_string($conn, $_POST['subject']);

                                    $sql = "SELECT * FROM images WHERE name LIKE '%$name%' AND modality LIKE '%$modality%' AND subject like '%$subject%'";

                                    echo '<input type=hidden name=name_hidden value='.$_POST['name'].'>';
                                    echo '<input type=hidden name=modality_hidden value='.$_POST['modality'].'>';
                                    echo '<input type=hidden name=subject_hidden value='.$_POST['subject'].'>';
                                } else {
                                    $sql = "SELECT * FROM images";
                                }
                                    
                                $result = mysqli_query($conn, $sql);
                                $queryResult =  mysqli_num_rows($result);

                                if ($queryResult > 0) {
                                    $index = 0;
                                    while ($row = mysqli_fetch_assoc($result)) {
                                        echo '<tr>';
                                        echo '<input type=hidden name='.$index.' value=0>';
                                        echo '<td>'.$row['name'].'</td>';
                                        echo '<td>'.$row['modality'].'</td>';
                                        echo '<td>'.$row['subject'].'</td>';
                                        echo '<td>'.$row['format'].'</td>';
                                        echo '</tr>';
                                            
                                        $index += 1;
                                    }
                                }

                            ?>
                        </tbody>
                    </table>            
                </div>
                <button name='submit-images' type='submit'>Submit</button>
            </form>
        </div>
    </div>

    <script type="module" src="browser.js"></script>
    
</body>
</html>