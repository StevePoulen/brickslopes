<?php

class Mocs {
    private $userId;
    private $requestMethod;

    public function __construct($userId) {
        $this->userId = $userId;
        $this->mocObj = new mocModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "POST") {
            $this->post();
        } else if ($requestMethod == "GET") {
            $this->get();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $data = $_GET;
        $this->mocObj->getMocInformation($data['eventId']);
        if ($this->mocObj->result) {
            $response = array();
            while($dbObj = $this->mocObj->result->fetch_object()) {
                array_push (
                    $response,
                    array (
                        'eventId' => $dbObj->eventId,
                        'userId' => $dbObj->userId,
                        'themeId' => $dbObj->themeId,
                        'title' => $dbObj->title,
                        'displayName' => $dbObj->displayName,
                        'mocImageUrl' => $dbObj->mocImageUrl,
                        'baseplateWidth' => $dbObj->baseplateWidth,
                        'baseplateDepth' => $dbObj->baseplateDepth,
                        'description' => $dbObj->description,
                        'theme' => $dbObj->theme
                    )    
                );
            }
            header("HTTP/1.0 200 Success");
            echo json_encode (
                $response
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
        $response = $this->mocObj->addMocInformation($payload);
        echo $response;
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Mocs($this->userId);

?>
