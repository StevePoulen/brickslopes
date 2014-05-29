<?php

class eventDates extends db {
    function __construct() {
        parent::__construct();
    }

    public function addEventDates($data) {
        return $this->query($this->insertQuery($data));
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
}
?>
