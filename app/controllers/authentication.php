<?php

    //header("HTTP/1.0 401 Unauthorized");
    print_r(json_decode(file_get_contents("php://input")));
    echo json_encode(
        array(
            'username' => $_POST['username'],
            'status' => '401'
        )
    );
?>
