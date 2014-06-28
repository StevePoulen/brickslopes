<?php

class events extends db {
    function __construct() {
        parent::__construct();
    }

    public function getEventInformation($data) {
        return $this->query($this->selectQuery($data));
    }

    public function addEventInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($data) {
        return "
            SELECT 
                name, 
                city, 
                state,
                year,
                tShirtCost,
                cost,
                discount,
                meetAndGreetCost,
                meetAndGreetDiscount,
                discountDate
            FROM
                EVENTS
            WHERE
                eventId = '{$this->escapeCharacters($data['eventId'])}'
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                events 
            (
                name, 
                city, 
                state,
                year,
                tShirtCost,
                cost,
                discount,
                meetAndGreetCost,
                meetAndGreetDiscount,
                discountDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['name'])}',
                '{$this->escapeCharacters($data['city'])}',
                '{$this->escapeCharacters($data['state'])}',
                '{$this->escapeCharacters($data['year'])}',
                '{$this->escapeCharacters($data['tShirtCost'])}',
                '{$this->escapeCharacters($data['cost'])}',
                '{$this->escapeCharacters($data['discount'])}',
                '{$this->escapeCharacters($data['meetAndGreetCost'])}',
                '{$this->escapeCharacters($data['meetAndGreetDiscount'])}',
                '{$this->escapeCharacters($data['discountDate'])}'
          )
        ;
      ";
    }
}
?>
