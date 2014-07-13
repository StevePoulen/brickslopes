<?php
//  require_once(__DIR__ . '/../lib/db.php');

class registrations extends db {
    function __construct() {
        parent::__construct();
    }

    public function getRegistrationInformationByUserId($userId) {
        return $this->query($this->selectQuery($userId));
    }

    public function getAllRegisteredUsers($eventId) {
        return $this->query($this->selectQueryByEventId($eventId));
    }

    public function addRegistrationInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function updateRegistrationInformation($data) {
        return $this->query($this->updateQuery($data));
    }

    public function updateRegistrationPaid($registrationId, $paidStatus, $amountPaid) {
        return $this->query($this->updatePaidQuery($registrationId, $paidStatus, $amountPaid));
    }

    private function selectQueryByEventId($eventId) {
        return "
            SELECT 
                e.eventId as eventId,
                e.name as eventName,
                r.registrationId as registrationId,
                u.userId as userId,
                u.firstName as firstName,
                u.lastName as lastName,
                u.email as email,
                u.city as city,
                u.state as state,
                IFNULL(r.paid,'NO') as paid,
                IFNULL(r.comments,'No Comments') as comments
            FROM
                registrations r,
                events e,
                users u
            WHERE
                r.eventId = '$eventId'
                AND r.eventId = e.eventId
                AND r.userId = u.userId
            ORDER BY
                u.lastName, 
                u.firstName
        ;
      ";
    }

    private function updatePaidQuery($registrationId, $paidStatus, $amountPaid) {
        return "
            UPDATE 
                registrations
            SET
                paid = '{$paidStatus}',
                amountPaid = '{$amountPaid}'
            WHERE
                registrationId = '{$this->escapeCharacters($registrationId)}'
        ;
      ";
    }

    private function selectQuery($userId) {
        return "
            SELECT 
                r.registrationId as registrationId,
                r.ageVerification as ageVerification,
                IFNULL(r.paid,'NO') as paid,
                IFNULL(r.comments,'') as comments,
                e.name as name,
                e.eventId
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
        $amountPaid = (ISSET($data['amountPaid']) ? $data['amountPaid'] : 0);
        return "
            INSERT INTO
                registrations 
            (
                eventId, 
                userId,
                ageVerification,
                comments,
                amountPaid,
                type,
                registrationDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['ageVerification'])}',
                '{$this->escapeCharacters($data['comments'])}',
                '{$this->escapeCharacters($amountPaid)}',
                '{$this->escapeCharacters($data['type'])}',
                NOW()
          )
        ;
      ";
    }

    private function updateQuery($data) {
        return "
            UPDATE 
                registrations 
            SET
                ageVerification = '{$this->escapeCharacters($data['ageVerification'])}',
                comments = '{$this->escapeCharacters($data['comments'])}'
            WHERE
                registrationId = '{$this->escapeCharacters($data['registrationId'])}'
        ;
      ";
    }
}
?>
