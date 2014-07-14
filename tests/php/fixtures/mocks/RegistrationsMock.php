<?php

class registrations extends db {
    function __construct() {
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
    protected $className;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/registrationsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->registrationId = $this->registrationId();
        $this->ageVerification = $this->ageVerification();
        $this->paid = $this->paid();
        $this->comments = $this->comments();
        $this->name = $this->name();
        $this->eventId = $this->eventId();
        $this->registrationLineItemId = $this->registrationLineItemId();
        $this->lineItem = $this->lineItem();
        $this->amount = $this->amount();
        $this->discount = $this->discount();
        $this->description = $this->description();
        $this->size = $this->size();
        $this->quantity = $this->quantity();
        $this->active = $this->active();
        $this->entryDate = $this->entryDate();
    }

    public function registrationId() { return $this->getData(0); }
    public function ageVerification() { return $this->getData(1); }
    public function paid() { return $this->getData(2); }
    public function comments() { return $this->getData(3); }
    public function name() { return $this->getData(4); }
    public function eventId() { return $this->getData(5); }
    public function registrationLineItemId() { return $this->getData(6); }
    public function lineItem() { return $this->getData(7); }
    public function amount() { return $this->getData(8); }
    public function discount() { return $this->getData(9); }
    public function description() { return $this->getData(10); }
    public function size() { return $this->getData(11); }
    public function quantity() { return $this->getData(12); }
    public function active() { return $this->getData(13); }
    public function entryDate() { return $this->getData(14); }
}

?>
