<?php

class eventDatesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addEventDates($data) {
        return $this->query($this->insertQuery($data));
    }

    public function getEventDates($data) {
        return $this->query($this->selectQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                eventDates
            (
                eventId, 
                startDate, 
                endDate,
                type 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['startDate'])}',
                '{$this->escapeCharacters($data['endDate'])}',
                '{$this->escapeCharacters($data['type'])}'
          )
        ;
      ";
    }

    private function selectQuery($data) {
        return "
            SELECT
                eventId, 
                startDate, 
                endDate,
                type 
            FROM
                eventDates
            WHERE
                eventId = '{$this->escapeCharacters($data['eventId'])}'
        ;
      ";
    }
}
?>
