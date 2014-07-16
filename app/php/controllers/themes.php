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
                if(array_key_exists($dbObj->themeId, $themesMap)) {
                    array_push (
                        $themesMap[$dbObj->themeId]['awards'],
                        array (
                            'award' => $dbObj->award,
                            'place' => $dbObj->place
                        )
                    );
                } else {
                    $themesMap[$dbObj->themeId] = array(
                        'theme' => $dbObj->theme,
                        'eventId' => $dbObj->eventId,
                        'themeId' => $dbObj->themeId,
                        'type' => $dbObj->type,
                        'awards' => array (
                            array (
                                'award' => $dbObj->award,
                                'place' => $dbObj->place,
                            )
                        )
                    );
                }
            }
            header("HTTP/1.0 200 Success");
            $returnObj = array();
            foreach($themesMap as $key => $object) {
                array_push($returnObj, $object);
            }
            echo json_encode (
                $returnObj
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Themes();

?>
