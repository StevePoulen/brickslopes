<?php

class Event {
    private $eventsObj;
    private $requestMethod;

    public function __construct() {
        $this->eventsObj = new events();
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
        $response = $this->eventsObj->getEventInformation($_GET);
        if ($response) {
            header("HTTP/1.0 200 Success");
            $dbObj = $this->eventsObj->result->fetch_object();
            echo json_encode (
                array (
                    'data' => array (
                        'name' => $dbObj->name,
                        'city' => $dbObj->city, 
                        'state' => $dbObj->state,
                        'year' => $dbObj->year,
                        'cost' => $dbObj->cost,
                        'discount' => $dbObj->discount,
                        'meetAndGreetCost' => $dbObj->meetAndGreetCost,
                        'meetAndGreetDiscount' => $dbObj->meetAndGreetDiscount,
                        'discountDate' => $dbObj->discountDate
                    ),
                    'status' => 200
                )
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Event();

?>
