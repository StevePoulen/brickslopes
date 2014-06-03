<?php

class usersObject extends modelObjects {
    protected $className;

    public function __construct() {
        $this->className = 'users';
        $this->userId = $this->userId();
        $this->firstName = $this->firstName();
        $this->lastName = $this->lastName();
    }

    public function userId() { return $this->getData(__FUNCTION__); }
    public function firstName() { return $this->getData(__FUNCTION__); }
    public function lastName() { return $this->getData(__FUNCTION__); }
}
?>
