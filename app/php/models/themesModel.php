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
                t.themeId as themeId,
                t.eventId as eventId, 
                t.theme as theme,
                ta.themeAwardId as themeAwardId,
                ta.award as award,
                ta.place as place
            FROM
                THEMES t,
                THEMEAWARDS ta
            WHERE
                t.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND t.themeId = ta.themeId
                ORDER by t.theme, ta.place
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
