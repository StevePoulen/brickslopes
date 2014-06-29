<?php

class registrationLineItemModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getRegistrationLineItemsByUserId($userId) {
        return $this->query($this->selectQuery($userId));
    }

    public function addRegistrationLineItems($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($userId) {
        return "
            SELECT 
                eventId, 
                userId, 
                lineItem,
                amount,
                paid,
                discount,
                description,
                size,
                entryDate
            FROM
                registrationLineItems
            WHERE
                userId = '{$userId}'
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                registrationLineItems 
            (
                eventId, 
                userId, 
                lineItem,
                amount,
                paid,
                discount,
                description,
                size,
                entryDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['lineItem'])}',
                '{$this->escapeCharacters($data['amount'])}',
                '{$this->escapeCharacters($data['paid'])}',
                '{$this->escapeCharacters($data['discount'])}',
                '{$this->escapeCharacters($data['description'])}',
                '{$this->escapeCharacters($data['size'])}',
                NOW()
          )
        ;
      ";
    }
}
?>
