<?php

  class mocModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllAfolMocs() {
       return $this->query($this->selectQuery());
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

    private function selectQuery() {
      return "
        SELECT
          firstName,
          lastName,
          email,
          title,
          displayName,
          mocImage,
          baseplateWidth,
          baseplateDepth,
          comments
        FROM
         afolMocs
        ORDER BY
          afolMocsId 
        ;
      ";
    }
  }
?>
