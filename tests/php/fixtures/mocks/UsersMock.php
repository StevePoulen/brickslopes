<?php

class users extends db {
    function __construct() {
        parent::__construct();
    }

    public function addUserInformation($data) {
        return $this->query();
    }

    public function authenticateUser($data) {
        return $this->query();
    }

    public function resetPassword($data, $password) {
        return $this->query();
    }

    public function updatePassword($userId, $data) {
        return $this->query();
    }

    public function getUserInformation($userId) {
        return $this->query();
    }

    public function getAllUserInformation() {
        return $this->query();
    }
}

class UsersMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/usersDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->userId = $this->userId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
        $this->admin = $this->admin();
        $this->email = $this->email();
        $this->address = $this->address();
        $this->city = $this->city();
        $this->state = $this->state();
        $this->zipcode = $this->zipcode();
        $this->phoneNumber = $this->phoneNumber();
        $this->joined = $this->joined();
    }

    public function userId() { return $this->getData(__FUNCTION__, 0); }
    public function firstName() { return $this->getData(__FUNCTION__, 1); }
    public function lastName() { return $this->getData(__FUNCTION__, 2); }
    public function email() { return $this->getData(__FUNCTION__, 3); }
    public function admin() { return $this->getData(__FUNCTION__, 4); }
    public function address() { return $this->getData(__FUNCTION__, 5); }
    public function city() { return $this->getData(__FUNCTION__, 6); }
    public function state() { return $this->getData(__FUNCTION__, 7); }
    public function zipcode() { return $this->getData(__FUNCTION__, 8); }
    public function phoneNumber() { return $this->getData(__FUNCTION__, 9); }
    public function joined() { return $this->getData(__FUNCTION__, 10); }
}
?>
