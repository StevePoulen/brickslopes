<?php

class registrations extends db {
    function __construct() {
        parent::__construct();
    }

    public function addRegistrationInformation($data) {
        return $this->query();
    }

    public function getRegistrationInformationByUserId($data) {
        return $this->query();
    }
}

class RegistrationsMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/registrationsDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->badgeLine1 = $this->badgeLine1();
        $this->badgeLine2 = $this->badgeLine2();
        $this->meetAndGreet = $this->meetAndGreet();
        $this->ageVerification = $this->ageVerification();
        $this->tShirtSize = $this->tShirtSize();
        $this->paid = $this->paid();
        $this->name = $this->name();
    }

    public function badgeLine1() { return $this->getData(__FUNCTION__,0); }
    public function badgeLine2() { return $this->getData(__FUNCTION__,1); }
    public function meetAndGreet() { return $this->getData(__FUNCTION__,2); }
    public function ageVerification() { return $this->getData(__FUNCTION__,3); }
    public function tShirtSize() { return $this->getData(__FUNCTION__,4); }
    public function paid() { return $this->getData(__FUNCTION__,5); }
    public function name() { return $this->getData(__FUNCTION__,6); }
}

?>
