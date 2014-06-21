<?php

class dbObject {
    private $fetchObjectCounter=0;
    private $fetchObjectCounterLimit=1;

    public function __construct() {
        $this->setFetchObjectCounterLimit();
    }

    private function setFetchObjectCounterLimit() {
        $this->fetchObjectCounterLimit = (ISSET($GLOBALS['fetch_object_counter_limit']) ? $GLOBALS['fetch_object_counter_limit'] : 1);
    }

    public function fetch_object() {
        if ($this->fetchObjectCounter < $this->fetchObjectCounterLimit ) {
            $GLOBALS['current_fetch_object_counter'] = $this->fetchObjectCounter;
            $this->fetchObjectCounter++;
            return new $GLOBALS['fetch_object']();
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
    protected $currentLineNumber = 0;
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

    public function getData($method, $position = 0) {
        if (ISSET($GLOBALS['current_fetch_object_counter'])) {
            $this->currentLineNumber = $GLOBALS['current_fetch_object_counter'];
        } else {
            $this->currentLineNumber = 0;
        }

        if (ISSET($this->dataSet)) {
            $columns = preg_split('/,/', rtrim($this->dataSet[$this->currentLineNumber]));
            return $columns[$position];
        }
        if (ISSET($GLOBALS[$this->className . "_$method"])) {
            return $GLOBALS[$this->className . "_$method"];
        } else {
            return 'd^3 => default dummy data';    
        }
    }
}

?>
