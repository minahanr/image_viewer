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

    $conditions = array();
    if (isset($_POST['name_hidden']) AND $_POST['name_hidden'] != '') {
        $name=mysqli_real_escape_string($conn, $_POST['name_hidden']);
        $conditions[] = 'name LIKE \''.$name.'\' AND ';
    }

    if (isset($_POST['modality_hidden']) AND $_POST['modality_hidden'] != '') {
        $modality=mysqli_real_escape_string($conn, $_POST['modality_hidden']);
        $conditions[] = 'modality LIKE \''.$modality.'\' AND ';
    }
    
    if (isset($_POST['subject_hidden']) AND $_POST['subject_hidden'] != '') {
        $subject=mysqli_real_escape_string($conn, $_POST['subject_hidden']);
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
        while ($row = mysqli_fetch_assoc($result)) {
            if ($_POST[strval($index)] == '1') {
                $selected_rows[] = $row;
            }

            $index += 1;
        }
    }

    if ($selected_rows > 0) {
        

        setcookie('selected_rows', json_encode($selected_rows), time() + 60*60*24, '/');
        echo count($selected_rows).' images selected! Return to the viewer and refresh the selected image database to view your updated image selection.';
    } else {
        echo 'No images selected.';
    }

?>