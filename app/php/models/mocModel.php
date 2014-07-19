<?php

  class mocModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function getMocInformation($eventId) {
       return $this->query($this->selectQuery($eventId));
    }

    public function addMocInformation($data) {
       return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
            mocs 
                (
                    eventId,
                    userId,
                    themeId,
                    title,
                    displayName,
                    mocImageUrl,
                    baseplateWidth,
                    baseplateDepth,
                    description
                )
            VALUES
                (
                    '{$this->escapeCharacters($data['eventId'])}',
                    '{$this->escapeCharacters($data['userId'])}',
                    '{$this->escapeCharacters($data['themeId'])}',
                    '{$this->escapeCharacters($data['title'])}',
                    '{$this->escapeCharacters($data['displayName'])}',
                    '{$this->escapeCharacters($data['mocImageUrl'])}',
                    '{$this->escapeCharacters($data['baseplateWidth'])}',
                    '{$this->escapeCharacters($data['baseplateDepth'])}',
                    '{$this->escapeCharacters($data['description'])}'
                )
            ;
        ";
    }

    private function selectQuery($eventId) {
        return "
            SELECT
                m.eventId,
                m.userId,
                m.themeId,
                m.title,
                m.displayName,
                m.mocImageUrl,
                m.baseplateWidth,
                m.baseplateDepth,
                m.description,
                t.theme
            FROM
                mocs m,
                themes t
            WHERE
                m.themeId = t.themeId
                AND m.eventId = '{$this->escapeCharacters($eventId)}'
            ORDER BY
                m.mocId 
            ;
        ";
    }
}
?>
