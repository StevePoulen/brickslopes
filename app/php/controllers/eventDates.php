<?php

class eventDates {
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
        } else {
            header("HTTP/1.0 405 Method Not Allowed");
        }
    }

    private function get() {
        $this->eventDatesObj->getEventDates($_GET);
        if ($this->eventDatesObj->result) {
            header("HTTP/1.0 200 Success");
            $eventDates = array(
                $_GET['eventId'] => array()
            );
            while ($dbObj = $this->eventDatesObj->result->fetch_object()) {
                $eventDates[$dbObj->eventId]['startDate'] = $dbObj->startDate;
                $eventDates[$dbObj->eventId]['endDate'] = $dbObj->endDate;
                $eventDates[$dbObj->eventId]['type'] = $dbObj->type;
            }

            echo json_encode (
                $eventDates
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new eventDates();

?>
