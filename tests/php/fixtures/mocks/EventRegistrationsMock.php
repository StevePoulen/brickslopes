<?php

class EventRegistrationsObject extends modelObjects {
    public function __construct() {
        parent::__construct('eventRegistrationsDB.txt');
    }

    public function userId() { return $this->getData(0); }
    public function firstName() { return $this->getData(1); }
    public function lastName() { return $this->getData(2); }
}
?>
