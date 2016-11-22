<?php

class RegisteredEventDates {
    private $eventDatesObj;
    private $requestMethod;

    public function __construct() {
        $this->eventDatesObj = new eventDatesModel();
        $this->determineRequestMethod();
    }

    private function determineRequestMethod() {
        $requestMethod = ISSET($_SERVER['REQUEST_METHOD']) 
            ? $_SERVER['REQUEST_METHOD']
            : 'error';

        if ($requestMethod == "GET") {
            $this->get();
        } else if ($requestMethod == "PATCH") {
            $this->patch();
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->eventDatesObj->getEventDate($_GET['eventId']);
        header("HTTP/1.0 200 Success");
        $eventDates = array();
        while ($dbObj = $this->eventDatesObj->result->fetch_object()) {
            array_push (
                $eventDates,
                array (
                    'eventDatesId' => $dbObj->eventDatesId,
                    'eventId' => $dbObj->eventId,
                    'startDate' => $dbObj->startDate . 'Z',
                    'endDate' => $dbObj->endDate . 'Z',
                    'type' => $dbObj->type
                )
            );
        }
        echo json_encode (
            $eventDates
        );
    }

    private function patch() {
        $payload = json_decode(file_get_contents("php://input"), true);
        if (sizeof($payload) == 0) {
            $payload = $_POST;
        }
        $response = $this->eventDatesObj->updateEventDates($payload);
        if (preg_match ( '/\d+/', $response )) {
            header("HTTP/1.0 200 Success");
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new RegisteredEventDates();

?>
