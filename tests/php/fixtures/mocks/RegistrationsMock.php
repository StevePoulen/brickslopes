<?php

class registrations extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new RegistrationsMock();
        parent::__construct();
    }

    public function updateRegistrationPaid($id, $registrationPaid, $amountPaid) {
        $GLOBALS['updateRegistrationPaid'] = array (
            'id' => $id,
            'registrationPaid' => $registrationPaid,
            'amountPaid' => $amountPaid
        );

        return $this->query();
    }

    public function updateRegistrationPaidByUserIdAndEventId($userId, $eventId) {
        $GLOBALS['updateRegistrationPaidByUserIdAndEventId'] = array (
            'userId' => $userId,
            'eventId' => $eventId
        );

        return $this->query();
    }

    public function addRegistrationInformation($data) {
        return $this->query();
    }

    public function updateRegistrationInformation($data) {
        return $this->query();
    }

    public function getRegistrationInformationByUserId($data) {
        return $this->query();
    }

    public function getAllRegisteredUsers($data) {
        return $this->query();
    }
}

class RegistrationsMock extends modelObjects {
    public function __construct() {
        parent::__construct('registrationsDB.txt');
    }

    public function registrationId() { return $this->getData(0); }
    public function ageVerification() { return $this->getData(1); }
    public function paid() { return $this->getData(2); }
    public function comments() { return $this->getData(3); }
    public function eventName() { return $this->getData(4); }
    public function eventId() { return $this->getData(5); }
    public function userId() { return $this->getData(6); }
    public function firstName() { return $this->getData(7); }
    public function lastName() { return $this->getData(8); }
    public function city() { return $this->getData(9); }
    public function state() { return $this->getData(10); }
    public function email() { return $this->getData(11); }
}

?>
