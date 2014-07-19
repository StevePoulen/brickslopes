<?php

class Games {
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

        header("HTTP/1.0 405 Method Not Allowed");
    }
}

new Games($this->userId);

?>
