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

    public function updateUserInformation($userId, $data) {
        return $this->query($this->updateQuery($userId, $data));
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
                password,
                joined
            )
        VALUES
          (
                '{$this->escapeCharacters($data['firstName'])}',
                '{$this->escapeCharacters($data['lastName'])}',
                '{$this->escapeCharacters($data['email'])}',
                password('{$this->escapeCharacters($data['password'])}'),
                NOW()
          )
        ;
      ";
    }

    private function updateQuery($userId, $data) {
        return "
            UPDATE 
                users 
            SET
                firstName = '{$this->escapeCharacters($data['firstName'])}',
                lastName = '{$this->escapeCharacters($data['lastName'])}',
                email = '{$this->escapeCharacters($data['email'])}',
                phoneNumber = '{$this->escapeCharacters($data['phoneNumber'])}',
                address = '{$this->escapeCharacters($data['address'])}',
                city = '{$this->escapeCharacters($data['city'])}',
                state = '{$this->escapeCharacters($data['state'])}',
                zipcode = '{$this->escapeCharacters($data['zipcode'])}',
                flickr = '{$this->escapeCharacters($data['flickr'])}'
            WHERE
                userId = {$userId}
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
