<?php

class SiteEmails extends db {
    protected $dbResult;

    function __construct() {
        $this->dbResult = new SiteEmailsMock();
        parent::__construct();
    }

    public function getSiteEmailsPreview() {
        return $this->query();
    }

    public function getSiteEmailsReady() {
        $currentRow = (ISSET($GLOBALS['currentLineNumber']) ? $GLOBALS['currentLineNumber'] : -1);
        return $this->query(NULL, $currentRow);
    }

    public function updateSiteEmailsToSent() {
        return $this->query();
    }
}

class SiteEmailsMock extends modelObjects {
    public function __construct() {
        parent::__construct('siteEmailsDB.txt');
    }

    public function siteEmailsId() { return $this->getData(0); }
    public function subject() { return $this->getData(1); }
    public function body() { return $this->getData(2); }
}
?>
