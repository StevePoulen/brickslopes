<?php

/*
include_once('../../models/starWars.php');

$starWarsObj = new StarWars();

$reservedCount = $starWarsObj->getReservedStarWarsSetsCount();
$availableCount = $starWarsObj->getAvailableStarWarsSetsCount();
$totalCount = $reservedCount + $availableCount;

$reservedId = $_GET['filter'] != "" ? $_GET['filter'] : null;

$starWarsObj->selectAllStarWarsSets($reservedId);
?>
*/
class StarWars {
    private $starWarsObject;
    private $requestMethod;
    private $userId;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->starWarsObject = new starWarsModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "GET") {
            $this->get();
        } else if ($requestMethod == "POST") {
            $this->post();
        } else if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->starWarsObject->selectAllStarWarsSets($_GET);
        if ($this->starWarsObject->result) {
            $starWarsMap = array();
            while($dbObj = $this->starWarsObject->result->fetch_object()) {
              $starWarsMap[$dbObj->id] = array (
                'id' => $dbObj->id,
                'setId' => $dbObj->setId,
                'description' => $dbObj->description,
                'genre' => $dbObj->genre,
                'year' => $dbObj->year,
                'availability' => $dbObj->availability,
                'packaging' => $dbObj->packaging,
                'image' => $dbObj->image,
                'userId' => $dbObj->userId,
                'user' => $dbObj->user
              );

            }
            header("HTTP/1.0 200 Success");
            $returnObj = array();
            foreach($starWarsMap as $key => $object) {
                array_push($returnObj, $object);
            }
            echo json_encode (
                $returnObj
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->starWarsObject->claimStarWarsSet($payload);

        if (preg_match ( '/^\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $payload['userId'] = $this->userId;
        $response = $this->starWarsObject->unclaimStarWarsSet($payload);

        if (preg_match ( '/^\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new StarWars($this->userId);

?>
