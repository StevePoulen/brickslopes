<?php
//  require_once(__DIR__ . '/../lib/db.php');

  class afols extends db {
    function __construct() {
        parent::__construct();
    }

    public function getAttendingAfols() {
       return $this->query($this->selectQuery());
    }

    public function selectAllAfols() {
       return $this->query($this->selectQuery());
    }

    public function verifyAfolByEmail($afolEmail) {
      $this->query($this->selectQuery($afolEmail));

      if ($this->result) {
        $obj = $this->result->fetch_object();
        return ($obj->afolsId == NULL ? "false" : "true");
      }
    }

    public function setAfolInformation($data) {
       return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
      return "
        INSERT INTO
         afols
          (
            firstName, 
            lastName, 
            email,
            address,
            city,
            state,
            zipcode,
            flickr,
            badgeLine1,
            badgeLine2,
            meetAndGreet,
            ageVerification,
            comments
          )
        VALUES
          (
            '{$this->escapeCharacters($data['firstName'])}',
            '{$this->escapeCharacters($data['lastName'])}',
            '{$this->escapeCharacters($data['email'])}',
            '{$this->escapeCharacters($data['address'])}',
            '{$this->escapeCharacters($data['city'])}',
            '{$this->escapeCharacters($data['state'])}',
            '{$this->escapeCharacters($data['zipcode'])}',
            '{$this->escapeCharacters($data['flickr'])}',
            '{$this->escapeCharacters($data['badgeLine1'])}',
            '{$this->escapeCharacters($data['badgeLine2'])}',
            '{$this->escapeCharacters($data['meetAndGreet'])}',
            '{$this->escapeCharacters($data['ageVerification'])}',
            '{$this->escapeCharacters($data['comments'])}'
          )
        ;
      ";
    }

    private function selectQuery($afolEmail=null) {
      $emailWhereStmt = "";
      if ($afolEmail) {
        $emailWhereStmt = " AND email = '$afolEmail'";
      }

      return "
        SELECT
          afolsId,
          firstName, 
          lastName, 
          email,
          address,
          city,
          state,
          zipcode,
          flickr,
          badgeLine1,
          badgeLine2,
          meetAndGreet,
          ageVerification,
          comments
        FROM
         afols
        WHERE
          active = 'yes'
        $emailWhereStmt
        ORDER BY
          afolsId 
        ;
      ";
    }
  }
?>
