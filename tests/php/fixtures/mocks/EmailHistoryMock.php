<?php

class EmailHistory extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new EmailHistoryMock();
        parent::__construct();
    }

    public function addEmailHistoryInformation($data) {
        if(!ISSET($GLOBALS['addEmailHistoryInformation'])) {
            $GLOBALS['addEmailHistoryInformation'] = array();
        }
        array_push($GLOBALS['addEmailHistoryInformation'], $data);
        return $this->query();
    }

    public function getEmailHistoryInformation() {
        return $this->query();
    }

    public function updateEmailHistoryInformation($data) {
        if(!ISSET($GLOBALS['updateEmailHistoryInformation'])) {
            $GLOBALS['updateEmailHistoryInformation'] = array();
        }

        $GLOBALS['updateEmailHistoryInformation']['status'] =  $data[0];
        if (ISSET($data[1])) {
            $GLOBALS['updateEmailHistoryInformation']['errorMessage'] =  $data[1];
        } else {
            $GLOBALS['updateEmailHistoryInformation']['errorMessage'] =  NULL;
        }
        return $this->query();
    }
}

class EmailHistoryMock extends modelObjects {
    public function __construct() {
        parent::__construct('emailHistoryDB.txt');
    }

    public function emailHistoryId() { return $this->getData(0); }
    public function emailAddress() { return $this->getData(1); }
    public function subject() { return $this->getData(2); }
    public function body() { return $this->getData(3); }
    public function type() { return $this->getData(4); }
}
?>
