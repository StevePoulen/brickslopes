<?php

class eventLineItems extends db {
    function __construct() {
        parent::__construct();
    }

    public function getEventLineItems($eventId) {
        return $this->query($this->selectQuery($eventId));
    }

    public function addEventLineItem($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($eventId) {
        return "
            SELECT 
                e.eventLineItemId,
                e.eventId, 
                ec.code, 
                e.lineItem,
                e.cost,
                e.discount,
                e.active
            FROM
                eventLineItems e,
                eventLineItemCodes ec
            WHERE
                e.eventId = '{$eventId}'
                AND e.eventLineItemCodeId = ec.eventLineItemCodeId
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                eventLineItems
            (
                eventId, 
                eventLineItemCodeId,
                lineItem,
                cost,
                discount,
                active
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['eventLineItemCodeId'])}',
                '{$this->escapeCharacters($data['lineItem'])}',
                '{$this->escapeCharacters($data['cost'])}',
                '{$this->escapeCharacters($data['discount'])}',
                '{$this->escapeCharacters($data['active'])}'
          )
        ;
      ";
    }
}
?>
