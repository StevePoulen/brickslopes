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

    public function updateSiteEmailsToSent($siteEmailsId) {
        return $this->query($this->updateQuery($siteEmailsId));
    }

    private function selectQuery($status='preview') {
        return "
            SELECT 
                siteEmailsId,
                subject,
                body
            FROM
                siteEmails
            WHERE
                status = '$status' 
        ;
      ";
    }

    private function updateQuery($siteEmailsId) {
        return "
            UPDATE 
                siteEmails
            SET
                status = 'sent'
            WHERE
                siteEmailsId = '$siteEmailsId' 
        ;
      ";
    }
}
?>
