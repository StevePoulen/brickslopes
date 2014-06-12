<?php

class dbObject {
    private $fetchObjectCounter = 0;

    public function __construct() {
    }

    public function fetch_object() {
        if ($this->fetchObjectCounter == 0 ) {
            $this->fetchObjectCounter++;
            return $GLOBALS['fetch_object'];
        } else {
            return null;
        }
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

    public function query($query=NULL) {
        return $GLOBALS['db_query'];
    }

    public function escapeCharacters() {}
}

class modelObjects {
    public function __construct() {

    }

    public function buildGlobalVariables() {
        foreach($this->getDTO() as $key => $value) {
            $GLOBALS[$this->className . '_' . $key] = $value;
        }
    }

    public function buildJsonString() {
        $output = '{"data":{';
        foreach($this->getDTO() as $key => $value) {
            $output .= '"' . $key . '":"'. $value . '",';
        }
        $output = preg_replace('/,$/', '', $output);
        $output .= '},"status":200}';
        return $output;
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
