<?php

class registrationLineItems {
    private $registrationLineItemObj;
    private $requestMethod;
    private $userId;

    public function __construct($userId = null, $runOnLine = null) {
        $this->registrationLineItemObj = new registrationLineItemModel();
        $this->userId = $userId;
        if ($runOnLine) { $this->determineRequestMethod(); }
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

    private function buildLineItemDTO($dbObj) {
        return array (
            'registrationLineItemId' => $dbObj->registrationLineItemId,
            'lineItemCode' => $dbObj->lineItemCode,
            'lineItem' => $dbObj->lineItem,
            'amount' => $dbObj->amount,
            'total' => $this->calculateTotal($dbObj->amount, $dbObj->quantity),
            'paid' => $dbObj->paid,
            'discount' => $dbObj->discount,
            'description' => $dbObj->description,
            'size' => $dbObj->size,
            'quantity' => $dbObj->quantity,
            'active' => $dbObj->active,
            'isOwner' => $dbObj->isOwner,
            'entryDate' => $dbObj->entryDate
        );
    }

    private function calculateTotal($amount, $quantity) {
        return money_format('%i', $quantity * $amount);
    }

    private function buildTotalAmounts($lineItemMap) {
        foreach($lineItemMap as $key => $lineItemObject) {
            $total = 0;
            $totalPaid = 0;
            $totalRemaining = 0;
            foreach($lineItemObject['lineItems'] as $lineItem) {
                $total += $lineItem['total'];
                if ($lineItem['paid'] === 'YES') {
                    $totalPaid += $lineItem['total'];
                } else {
                    $totalRemaining += $lineItem['total'];
                }
            }
            $lineItemMap[$key]['total'] = $this->calculateTotal($total, 1);
            $lineItemMap[$key]['totalPaid'] = $this->calculateTotal($totalPaid, 1);
            $lineItemMap[$key]['totalRemaining'] = $this->calculateTotal($totalRemaining, 1);
        }

        return $lineItemMap;
    }

    private function buildLineItemObject() {
        $lineItemMap = array();
        while($dbObj = $this->registrationLineItemObj->result->fetch_object()) {
            if(array_key_exists($dbObj->eventId, $lineItemMap)) {
                array_push (
                    $lineItemMap[$dbObj->eventId]['lineItems'],
                    $this->buildLineItemDTO($dbObj)
                );
            } else {
                $lineItemMap[$dbObj->eventId] = array(
                    'total' => 0,
                    'lineItems' => array (
                        $this->buildLineItemDTO($dbObj)
                    )
                );
            }
        }

        return $this->buildTotalAmounts($lineItemMap);
    }

    public function getRegisteredLineItems($userId, $eventId) {
        $this->registrationLineItemObj->getRegistrationLineItemsByUserId($userId, $eventId);
        if ($this->registrationLineItemObj->result) {
            $lineItemMap = $this->buildLineItemObject();
            try {
                return $lineItemMap[$eventId];
            } catch (exception $e) {
                return array();
            }
        } else {
            return array();
        }
    }

    private function get() {
        $payload = $_GET;
        $this->registrationLineItemObj->getRegistrationLineItemsByUserId(
            $this->userId,
            $payload['eventId']
        );
        if ($this->registrationLineItemObj->result) {
            $lineItemMap = $this->buildLineItemObject();
            header("HTTP/1.0 200 Success");
            echo json_encode (
                $lineItemMap
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
        }
    }
}

try {
    if (ISSET($this)) {
        $userId = $this->userId;
        $runOnLine = true;
    } else {
        $userId = null;
        $runOnLine = false;
    }
} catch (exception $e) {
    $userId = null;
    $runOnLine = false;
}

new registrationLineItems($userId, $runOnLine);

?>
