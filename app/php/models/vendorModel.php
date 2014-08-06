<?php

class vendorModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addVendorInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    public function getVendorInformation($eventId) {
        return $this->query($this->selectQuery($eventId));
    }

    public function addVendorConnectorInformation($data) {
        return $this->query($this->insertVendorConnectorQuery($data));
    }

    private function selectQuery($eventId) {
        return "
            SELECT 
                v.vendorId,
                v.name,
                v.description,
                v.url,
                v.logo,
                vc.tables
            FROM
                vendors v,
                vendorConnector vc
            WHERE
                v.vendorId = vc.vendorId
                AND vc.eventId = '{$this->escapeCharacters($eventId)}'
            ORDER BY
                v.name
        ;
      ";
    }

    private function insertVendorConnectorQuery($data) {
        return "
            INSERT INTO
                vendorConnector
            (
                eventId,
                userId, 
                vendorId, 
                tables,
                registrationDate 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['vendorId'])}',
                '{$this->escapeCharacters($data['tables'])}',
                now()
          )
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                vendors
            (
                name,
                description, 
                url, 
                logo, 
                creationDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['name'])}',
                '{$this->escapeCharacters($data['description'])}',
                '{$this->escapeCharacters($data['url'])}',
                '{$this->escapeCharacters($data['logo'])}',
                now()
          )
        ;
      ";
    }
}
?>
