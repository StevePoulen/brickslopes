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
                    'eventId' => $dbObj->eventId,
                    'name' => $dbObj->name,
                    'city' => $dbObj->city, 
                    'state' => $dbObj->state,
                    'year' => $dbObj->year,
                    'discountDate' => $dbObj->discountDate,
                    'lineItems' => array ()
                );

                $lineItemsMap = array();
                while ($dbObj = $eventLineItemsObj->result->fetch_object()) {
                    $lineItemsMap[$dbObj->code] = array (
                        'lineItem' => $dbObj->lineItem,
                        'cost' => $dbObj->cost,
                        'discount' => $dbObj->discount,
                        'active' => $dbObj->active
                    );

                    if ($dbObj->linkType === 'GAME') {
                        $lineItemsMap[$dbObj->code]['gameId'] = $dbObj->linkId;
                    }
                }

                $eventResponse['lineItems'] = $lineItemsMap;

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
