<?php

class Games {
    private $gamesObj;
    private $requestMethod;

    public function __construct() {
        $this->gamesObj = new gamesModel();
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
        $this->gamesObj->getGameInformation($_GET);
        if ($this->gamesObj->result) {
            $gamesMap = array();
            while($dbObj = $this->gamesObj->result->fetch_object()) {
                if(array_key_exists($dbObj->gameId, $gamesMap)) {
                    if ($dbObj->award) {
                        array_push (
                            $gamesMap[$dbObj->gameId]['awards'],
                            array (
                                'award' => $dbObj->award,
                                'place' => $dbObj->place
                            )
                        );
                    }
                } else {
                    $gamesMap[$dbObj->gameId] = array (
                        'eventId' => $dbObj->eventId,
                        'gameId' => $dbObj->gameId,
                        'game' => $dbObj->game,
                        'display' => $dbObj->display,
                        'description' => $dbObj->description,
                        'image' => $dbObj->image,
                        'maxParticipants' => $dbObj->maxParticipants,
                        'currentParticipants' => $dbObj->currentParticipants,
                        'openRegistration' => $dbObj->openRegistration
                    );

                    if ($dbObj->award) {
                        $gamesMap[$dbObj->gameId]['awards'] = array (
                            array (
                                'award' => $dbObj->award,
                                'place' => $dbObj->place,
                            )
                        );
                    }
                }
            }
            header("HTTP/1.0 200 Success");
            $returnObj = array();
            foreach($gamesMap as $key => $object) {
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

new Games();

?>
