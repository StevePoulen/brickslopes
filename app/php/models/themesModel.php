<?php

class themesModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getThemeInformation($data) {
        return $this->query($this->selectQuery($data));
    }

    public function addThemeInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($data) {
        return "
            SELECT 
                eventId, 
                theme 
            FROM
                THEMES
            WHERE
                eventId = '{$this->escapeCharacters($data['eventId'])}'
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                themes 
            (
                eventId, 
                theme 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['theme'])}'
          )
        ;
      ";
    }
}
?>
