<?php

class eventDatesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addEventDates($data) {
        return $this->query($this->insertQuery($data));
    }

    public function updateEventDates($data) {
        return $this->query($this->updateQuery($data));
    }

    public function getEventDates() {
        return $this->query($this->selectQuery(''));
    }

    public function getEventDate($eventId) {
        return $this->query($this->selectQuery($eventId));
    }

    private function updateQuery($data) {
        return "
            UPDATE
                eventDates
            SET
                startDate = '{$this->escapeCharacters($data['startDate'])}',
                endDate = '{$this->escapeCharacters($data['endDate'])}'
            WHERE
                eventDatesId = '{$this->escapeCharacters($data['eventDatesId'])}'
        ;
      ";
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

    private function selectQuery($eventId) {
        $eventWhereStatement = "";
        if ($eventId) {
            $eventWhereStatement = " WHERE eventId = '$eventId' ";
        }
        return "
            SELECT
                eventDatesId,
                eventId, 
                startDate, 
                endDate,
                type 
            FROM
                eventDates
            $eventWhereStatement
            ORDER BY
                eventId, type, startDate
        ;
      ";
    }
}
?>
