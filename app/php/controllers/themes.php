<?php

class Themes {
    private $themesObj;
    private $requestMethod;

    public function __construct() {
        $this->themesObj = new themesModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "GET") {
            $this->get();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->themesObj->getThemeInformation($_GET);
        if ($this->themesObj->result) {
            $themesMap = array();
            while($dbObj = $this->themesObj->result->fetch_object()) {
                array_push(
                    $themesMap,
                    array (
                        'eventId' => $dbObj->eventId,
                        'theme' => $dbObj->theme 
                    )
                );
            }
            header("HTTP/1.0 200 Success");
            echo json_encode (
                $themesMap
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Themes();

?>
