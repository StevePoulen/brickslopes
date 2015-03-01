<?php

class siteEmails extends db {
    function __construct() {
        parent::__construct();
    }

    public function getSiteEmailsPreview() {
        return $this->query($this->selectQuery());
    }

    public function getSiteEmailsReady() {
        return $this->query($this->selectQuery('ready'));
    }

    private function selectQuery($status='preview') {
        return "
            SELECT 
                subject,
                body
            FROM
                siteEmails
            WHERE
                status = '$status' 
        ;
      ";
    }
}
?>
