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

    public function updateMocInformation($data) {
       return $this->query($this->updateQuery($data));
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
                    description,
                    isTfol,
                    isSet
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
                    '{$this->escapeCharacters($data['description'])}',
                    '{$this->escapeCharacters($data['isTfol'])}',
                    '{$this->escapeCharacters($data['isSet'])}'
                )
            ;
        ";
    }

    private function updateQuery($data) {
        return "
            UPDATE 
                mocs 
            SET 
                themeId = '{$this->escapeCharacters($data['themeId'])}',
                title = '{$this->escapeCharacters($data['title'])}',
                displayName = '{$this->escapeCharacters($data['displayName'])}',
                mocImageUrl = '{$this->escapeCharacters($data['mocImageUrl'])}',
                baseplateWidth = '{$this->escapeCharacters($data['baseplateWidth'])}',
                baseplateDepth = '{$this->escapeCharacters($data['baseplateDepth'])}',
                description = '{$this->escapeCharacters($data['description'])}',
                isTfol = '{$this->escapeCharacters($data['isTfol'])}',
                isSet = '{$this->escapeCharacters($data['isSet'])}'
            WHERE
                mocId = '{$this->escapeCharacters($data['mocId'])}'
            ;
        ";
    }

    private function selectQuery($eventId) {
        return "
            SELECT
                m.mocId,
                m.eventId,
                m.userId,
                m.themeId,
                m.title,
                m.displayName,
                m.mocImageUrl,
                m.baseplateWidth,
                m.baseplateDepth,
                m.description,
                t.theme,
                m.isTfol,
                m.isSet
            FROM
                mocs m,
                themes t
            WHERE
                m.themeId = t.themeId
                AND m.eventId = '{$this->escapeCharacters($eventId)}'
            ORDER BY
                m.displayName
            ;
        ";
    }
}
?>
