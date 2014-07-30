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
                cost,
                discountDate
            FROM
                events
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
                discountDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['name'])}',
                '{$this->escapeCharacters($data['city'])}',
                '{$this->escapeCharacters($data['state'])}',
                '{$this->escapeCharacters($data['year'])}',
                '{$this->escapeCharacters($data['discountDate'])}'
          )
        ;
      ";
    }
}
?>
