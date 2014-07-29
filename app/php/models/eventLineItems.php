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
                eventLineItemId,
                eventId, 
                lineItem,
                cost,
                discount,
                active
            FROM
                eventLineItems
            WHERE
                eventId = '{$eventId}'
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                eventLineItems
            (
                eventId, 
                lineItem,
                cost,
                discount,
                active
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
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
