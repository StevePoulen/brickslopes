<?php
//  require_once(__DIR__ . '/../lib/db.php');

  class AfolMocs extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllAfolMocs() {
       return $this->query($this->selectQuery());
    }

    public function setAfolMocInformation($data) {
       return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
      return "
        INSERT INTO
         afolMocs
          (
            firstName,
            lastName,
            email,
            title,
            displayName,
            mocImage,
            baseplateWidth,
            baseplateDepth,
            comments
          )
        VALUES
          (
            '{$this->escapeCharacters($data['firstName'])}',
            '{$this->escapeCharacters($data['lastName'])}',
            '{$this->escapeCharacters($data['email'])}',
            '{$this->escapeCharacters($data['mocTitle'])}',
            '{$this->escapeCharacters($data['displayName'])}',
            '{$this->escapeCharacters($data['mocImage'])}',
            '{$this->escapeCharacters($data['baseplateWidth'])}',
            '{$this->escapeCharacters($data['baseplateDepth'])}',
            '{$this->escapeCharacters($data['comments'])}'
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
