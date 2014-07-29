<?php

class themesModel extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new ThemesMock();
        parent::__construct();
    }

    public function getThemeInformation() {
        return $this->query();
    }
}

class ThemesMock extends modelObjects {
    public function __construct() {
        parent::__construct('themesDB.txt');
    }

    public function themeId() { return $this->getData(0); }
    public function eventId() { return $this->getData(1); }
    public function theme() { return $this->getData(2); }
    public function type() { return $this->getData(3); }
    public function themeAwardId() { return $this->getData(4); }
    public function award() { return $this->getData(5); }
    public function place() { return $this->getData(6); }
    public function selectable() { return $this->getData(7); }
}
?>
