<?php
    session_start();
    $db_servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $db_name = "image_viewer";

    $conn = mysqli_connect($db_servername, $db_username, $db_password, $db_name);
    
    if (mysqli_connect_errno()) {
        printf("Connect failed: %s\n", mysqli_connect_error());
        exit();
    }
    
    $conditions = array();
    if (isset($_GET['name']) AND $_GET['name'] != '') {
        $name=mysqli_real_escape_string($conn, $_GET['name']);
        $conditions[] = 'name LIKE \''.$name.'\' AND ';
    }

    if (isset($_GET['modality']) AND $_GET['modality'] != '') {
        $modality=mysqli_real_escape_string($conn, $_GET['modality']);
        $conditions[] = 'modality LIKE \''.$modality.'\' AND ';
    }
    
    if (isset($_GET['subject']) AND $_GET['subject'] != '') {
        $subject=mysqli_real_escape_string($conn, $_GET['subject']);
        $conditions[] = 'subject LIKE \''.$subject.'\' AND ';
    }
    
    

    $sql = 'SELECT * FROM images';

    if (count($conditions) > 0) {
            $sql = $sql.' WHERE ';        
        for ($i = 0; $i < count($conditions); $i++) {
            $sql = $sql.$conditions[$i];
        }

        $sql = substr($sql, 0, -5);
    }

    $result = mysqli_query($conn, $sql);
    $queryResult =  mysqli_num_rows($result);

    $selected_rows = array();

    if ($queryResult > 0) {
        $index = 0;
        echo "<table>";
        echo "<thead><tr> <th>Name</th> <th>Modality</th> <th>Subject</th></thead><tbody>";
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<tr><td>".$row['name']."</td><td>".$row['modality']."</td><td>".$row['subject']."</td>";
            echo "<td style='display: none;'>".$row['series_id']."</td><td style='display: none;'>".$row['format']."</td><td style='display: none;'>".$row['base_url']."</td>";
            echo "<td style='display: none;'>".$row['num_frames']."</td><td style='display: none;'>".$row['imgs_per_frame']."</td><tr>";
        }
        echo "</tbody></table>";
    }

?>