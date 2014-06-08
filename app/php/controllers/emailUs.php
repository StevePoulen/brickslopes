<?php

class emailUs {
    public function __construct() {
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "POST") {
            $this->post();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function post() {
        $payload = json_decode(file_get_contents("php://input"), true);
        $emailObj = new mail('brianpilati@gmail.com');
        $emailObj->sendEmailUsMessage($payload);
        header("HTTP/1.0 200 Success");
    }
}

new emailUs();

?>
