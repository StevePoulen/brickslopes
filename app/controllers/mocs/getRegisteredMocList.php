<?php
    include_once(__DIR__ . '/../../models/afolMocs.php');

    $afolMocsObj = new AfolMocs();
    $afolMocCount = $afolMocsObj->selectAllAfolMocs();

    $mocList = Array();
    
    if ($afolMocsObj->result) {
        while($dbObj = $afolMocsObj->result->fetch_object()) {
            array_push($mocList, 
                Array (
                    'firstName' => $dbObj->firstName,
                    'lastName' => $dbObj->lastName,
                    'title' => $dbObj->title,
                    'baseplateWidth' => $dbObj->baseplateWidth,
                    'baseplateDepth' => $dbObj->baseplateDepth
                )
            );

        }
    }

    echo json_encode(
        array(
            'afolMocCount' => $afolMocCount,
            'mocs' => $mocList
        )
    );
?>
