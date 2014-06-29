<?php
//  require_once(__DIR__ . '/../lib/db.php');

class registrations extends db {
    function __construct() {
        parent::__construct();
    }

    public function getRegistrationInformationByUserId($userId) {
        return $this->query($this->selectQuery($userId));
    }

    public function addRegistrationInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function selectQuery($userId) {
        return "
            SELECT 
                r.badgeLine1 as badgeLine1,
                r.badgeLine2 as badgeLine2,
                r.meetAndGreet as meetAndGreet,
                r.ageVerification as ageVerification,
                r.tShirtSize as tShirtSize,
                IFNULL(r.paid,'NO') as paid,
                e.name as name
            FROM
                registrations r,
                events e,
                eventDates ed
            WHERE
                r.userId = '$userId'
                AND r.eventId = e.eventId
                AND e.eventId = ed.eventId
                AND ed.startDate > now()
            GROUP BY
                ed.eventId
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                registrations 
            (
                eventId, 
                userId,
                badgeLine1,
                badgeLine2,
                meetAndGreet,
                ageVerification,
                comments,
                tShirtSize,
                amountPaid,
                type,
                registrationDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['badgeLine1'])}',
                '{$this->escapeCharacters($data['badgeLine2'])}',
                '{$this->escapeCharacters($data['meetAndGreet'])}',
                '{$this->escapeCharacters($data['ageVerification'])}',
                '{$this->escapeCharacters($data['comments'])}',
                '{$this->escapeCharacters($data['tShirtSize'])}',
                '{$this->escapeCharacters($data['amountPaid'])}',
                '{$this->escapeCharacters($data['type'])}',
                NOW()
          )
        ;
      ";
    }
}
?>
