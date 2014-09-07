<?php

class users extends \db {
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

    public function updatePassword($userId, $data) {
        return $this->query($this->updatePasswordQuery($userId, $data));
    }

    public function updateTour($data) {
        echo $this->updateTourQuery($data);
        return $this->query($this->updateTourQuery($data));
    }

    public function addUserInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function updateUserInformation($userId, $data) {
        return $this->query($this->updateQuery($userId, $data));
    }

    public function getUserInformation($userId) {
        return $this->query($this->selectQuery(array('userId' => $userId)));
    }

    public function getUserInformationByEmail($email) {
        return $this->query($this->selectQuery(array('email' => $email)));
    }

    public function getAllUserInformation() {
        return $this->query($this->selectQuery(null, false));
    }

    private function updateTourQuery($data) {
        return "
            UPDATE 
                users 
            SET
                showTour = '{$this->escapeCharacters($data['tourOption'])}'
            WHERE
                userId = '{$this->escapeCharacters($data['userId'])}'
        ";
    }

    private function updatePasswordQuery($userId, $data) {
        return "
            UPDATE 
                users 
            SET
                password = password('{$this->escapeCharacters($data['newPassword'])}')
            WHERE
                userId = '{$this->escapeCharacters($userId)}'
                AND password = password('{$this->escapeCharacters($data['oldPassword'])}')
        ";
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
                u.userId,
                u.firstName,
                u.lastName,
                u.admin,
                IF(
                    'NO' = IFNULL(r.registrationId, 'NO'), 
                    'NO', 
                    'YES'
                ) AS 'registered',
                IF(r.paid = 'YES', 'YES', 'NO') AS 'paid'
            FROM
                users u
                    LEFT JOIN
                registrations r
                    ON
                    u.userId = r.userId
                    AND r.eventId = 2
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

    private function selectQuery($data, $isSingleUser=true) {
        $whereStatement = "";
        if ($isSingleUser) {
            if (ISSET($data['userId'])) {
                $whereStatement = " WHERE userId = '{$this->escapeCharacters($data['userId'])}'";
            } else {
                $whereStatement = " WHERE email = '{$this->escapeCharacters($data['email'])}'";
            }
        }
        return "
            SELECT 
                userId,
                IFNULL(firstName, 'First Name') as firstName,
                IFNULL(lastName, 'Last Name') as lastName,
                email,
                CASE 
                    WHEN 
                        phoneNumber IS NULL OR phoneNumber = '' 
                    THEN 
                        '555-555-5555'
                    ELSE 
                        phoneNumber
                END AS 'phoneNumber',
                IFNULL(address, 'Address') as address,
                IFNULL(city, 'City') as city,
                IFNULL(state, 'State') as state,
                IFNULL(zipcode, 'Zipcode') as zipcode,
                flickr,
                familyId,
                admin,
                showTour,
                joined
            FROM
                users 
            $whereStatement
        ;
      ";
    }

    private function updateQuery($userId, $data) {
        $familyId = $adminId = "";
        if (ISSET($data['familyId'])) {
            $familyId = ",familyId = '{$this->escapeCharacters($data['familyId'])}'";
        }
        if (ISSET($data['admin'])) {
            $adminId = ",admin = '{$this->escapeCharacters($data['admin'])}'";
        }
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
                $familyId
                $adminId
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
}
?>
