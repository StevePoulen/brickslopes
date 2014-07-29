<?php

class users extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new UsersMock();
        parent::__construct();
    }

    public function addUserInformation($data) {
        return $this->query();
    }

    public function updateUserInformation($data) {
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
    public function __construct() {
        parent::__construct('usersDB.txt');
    }

    public function userId() { return $this->getData(0); }
    public function firstName() { return $this->getData(1); }
    public function lastName() { return $this->getData(2); }
    public function email() { return $this->getData(3); }
    public function admin() { return $this->getData(4); }
    public function address() { return $this->getData(5); }
    public function city() { return $this->getData(6); }
    public function state() { return $this->getData(7); }
    public function zipcode() { return $this->getData(8); }
    public function phoneNumber() { return $this->getData(9); }
    public function flickr() { return $this->getData(10); }
    public function joined() { return $this->getData(11); }
    public function registered() { return $this->getData(12); }
    public function paid() { return $this->getData(13); }
}
?>
