<?php
  require_once(__DIR__ . '/../lib/db.php');

  class users extends db {
    function __construct() {
        parent::__construct();
    }

    public function authenticateUser($data) {
        return $this->query($this->authenticationQuery($data));
    }

    public function resetPassword($data, $password) {
        $this->query($this->resetQuery($data, $password));
        return $this->query($this->selectQueryByEmail($data));
    }

    public function addUserInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function updateUserInformation($data) {
        return $this->query($this->updateQuery($data));
    }

    private function resetQuery($data, $password) {
        return "
            UPDATE 
                users 
            SET
                password = password('{$this->escapeCharacters($password)}')
            WHERE
                email = '{$this->escapeCharacters($data['email'])}'
        ";
    }

    private function authenticationQuery($data) {
        return "
            SELECT 
                userId,
                firstName,
                lastName
            FROM
                users 
            WHERE
                email = '{$this->escapeCharacters($data['email'])}'
                AND password = password('{$this->escapeCharacters($data['password'])}')
        ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                users 
            (
                firstName, 
                lastName, 
                email,
                password
            )
        VALUES
          (
                '{$this->escapeCharacters($data['firstName'])}',
                '{$this->escapeCharacters($data['lastName'])}',
                '{$this->escapeCharacters($data['email'])}',
                password('{$this->escapeCharacters($data['password'])}')
          )
        ;
      ";
    }

    private function updateQuery($data) {
        return "
            INSERT INTO
                users 
            (
                firstName, 
                lastName, 
                email,
                password,
                phoneNumber,
                address,
                city,
                state,
                zipcode
            )
        VALUES
          (
                '{$this->escapeCharacters($data['firstName'])}',
                '{$this->escapeCharacters($data['lastName'])}',
                '{$this->escapeCharacters($data['email'])}',
                password('{$this->escapeCharacters($data['password'])}'),
                '{$this->escapeCharacters($data['phoneNumber'])}',
                '{$this->escapeCharacters($data['address'])}',
                '{$this->escapeCharacters($data['city'])}',
                '{$this->escapeCharacters($data['state'])}',
                '{$this->escapeCharacters($data['zipcode'])}
          )
        ;
      ";
    }

    private function selectQueryByEmail($data) {
        return "
            SELECT
                userId,
                firstName, 
                lastName, 
                email,
                phoneNumber,
                address,
                city,
                state,
                zipcode
            FROM
                users 
            WHERE
                email = '{$this->escapeCharacters($data['email'])}'
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
