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
}

class usersObject extends modelObjects {
    protected $dataSet;

    public function __construct() {
        $this->dataSet = file(__DIR__ . '/../artifacts/usersDB.txt');
        $GLOBALS['fetch_object_counter_limit'] = sizeOf($this->dataSet);
        $this->userId = $this->userId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
        $this->admin = $this->admin();
        $this->email = $this->admin();
    }

    public function userId() { return $this->getData(__FUNCTION__, 0); }
    public function firstName() { return $this->getData(__FUNCTION__, 1); }
    public function lastName() { return $this->getData(__FUNCTION__, 2); }
    public function email() { return $this->getData(__FUNCTION__, 3); }
    public function admin() { return $this->getData(__FUNCTION__, 4); }
}
?>
