<?php

class Mail {
    public function __construct() { }

    public function sendResetEmailMessage($a, $b) {
        $GLOBALS['sendResetEmailMessage_password'] = $b;
    }
}


class dbObject {
    public function __construct() {

    }

    public function fetch_object() {
        return $GLOBALS['fetch_object'];
    }
}
    
class db {
    public function __construct() {
        $this->result = $this->getResult();
    }

    private function getResult() {
        if(ISSET($GLOBALS['db_result'])) {
            return false;
        } else {
            return new dbObject();
        }
    }

    public function query($query) {
        return $GLOBALS['db_query'];
    }

    public function escapeCharacters() {}
}

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

class modelObjects {
    public function __construct() {

    }

    public function getData($method) {
        if (ISSET($GLOBALS[$this->className . "_$method"])) {
            return $GLOBALS[$this->className . "_$method"];
        } else {
            return 'd^3 => default dummy data';    
        }
    }
}

?>
