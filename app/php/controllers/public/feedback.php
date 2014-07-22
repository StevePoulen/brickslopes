<?php

class Feedback {
    private $feedbackObj;
    private $requestMethod;
    private $userId;

    function __construct($userId) {
        $this->userId = $userId;
        $this->feedbackObj = new feedbackModel();
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
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $feedback = array();
        $response = $this->feedbackObj->getFeedbackInformation();
        if ($response) {
            header("HTTP/1.0 200 Success");
            while($dbObj = $this->feedbackObj->result->fetch_object()) {
                array_push(
                    $feedback,
                    array (
                        'feedbackId' => $dbObj->feedbackId,
                        'userId' => $dbObj->userId,
                        'email' => $dbObj->email, 
                        'feedback' => $dbObj->feedback,
                        'posted' => $dbObj->posted
                    )
                );
            }
            echo json_encode (
                $feedback
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
        $response = $this->feedbackObj->addFeedbackInformation($payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 201 Created");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Feedback($this->userId);

?>
