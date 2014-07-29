<?php

class db {
    public function __construct() {
        $this->result = $this->getResult();
    }

    private function getResult() {
        if(ISSET($GLOBALS['db_result'])) {
            return false;
        } else {
            return $this->dbResult;
        }
    }

    public function query($query=NULL) {
        $this->dbResult->currentLineNumber = -1;
        return $GLOBALS['db_query'];
    }

    public function escapeCharacters() {}
}

class modelObjects {
    public $rowsOfData = 0;
    public $currentLineNumber = -1;
    public function __construct($file) {
        $this->currentLineNumber = -1;
        $this->dataSet = file(__DIR__ . "/../artifacts/$file");
        $this->rowsOfData = sizeOf($this->dataSet);
    }

    public function fetch_object() {
        $this->currentLineNumber++;
        if ($this->currentLineNumber < $this->rowsOfData) {
            return $this;
        } else {
            return null;
        }
    }

    private function replaceNull($input) {
        return preg_replace('/null/', null, $input);
    }

    private function rTrim($input) {
        return rtrim($input);
    }

    private function columnize($input) {
        return preg_split(
            '/,/', 
            $input
        );
    }

    private function getRowData() {
        return $this->dataSet[$this->currentLineNumber];
    }
    private function getColumns() {
        return $this->columnize($this->replaceNull($this->rTrim($this->getRowData())));
    }

    public function __get($name) {
        if (method_exists($this, $name)) {
            return $this->$name();
        } else {
            print "\n\n\n$name\n\n\n";
            throw "error";
        }
    }

    public function getData($position = 0) {
        if (ISSET($this->dataSet) && $this->currentLineNumber > -1) {
            $columns = $this->getColumns();
            return $columns[$position];
        }
    }
}

?>
