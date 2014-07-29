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
            $eventLineItemsObj = new eventLineItems();
            $eventLineItemsObj->getEventLineItems($_GET['eventId']);
            header("HTTP/1.0 200 Success");
            if($dbObj = $this->eventsObj->result->fetch_object()) {
                $eventResponse = array (
                    'data' => array (
                        'name' => $dbObj->name,
                        'city' => $dbObj->city, 
                        'state' => $dbObj->state,
                        'year' => $dbObj->year,
                        'lineItems' => array ()
                    ),
                    'status' => 200
                );

                $lineItemsMap = array();
                while ($dbObj = $eventLineItemsObj->result->fetch_object()) {
                    $lineItemsMap[$dbObj->lineItem] = array (
                        'lineItem' => $dbObj->lineItem,
                        'cost' => $dbObj->cost,
                        'discount' => $dbObj->discount,
                        'active' => $dbObj->active
                    );
                }

                $eventResponse['data']['lineItems'] = $lineItemsMap;

                echo json_encode (
                    $eventResponse
                );
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

new Event();

?>
