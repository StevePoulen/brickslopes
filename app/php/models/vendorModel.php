<?php

class vendorModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addVendorInformation($data) {
        $vendorId = $this->query($this->insertQuery($data));
        if ($vendorId > 0) {
            $data['vendorId'] = $vendorId;
            $this->query($this->insertVendorConnectorQuery($data));
        }
        return $vendorId;
    }

    public function getVendorInformation($eventId) {
        return $this->query($this->selectQuery($eventId));
    }

    public function addVendorConnectorInformation($data) {
        return $this->query($this->insertVendorConnectorQuery($data));
    }

    public function getVendorAssociateInformation($data) {
        return $this->query($this->selectAssociateQuery($data));
    }

    private function selectQuery($eventId) {
        return "
            SELECT 
                v.vendorId,
                v.name,
                v.description,
                v.url,
                v.logo,
                vc.tables,
                vc.type
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
                type,
                registrationDate 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['vendorId'])}',
                '{$this->escapeCharacters($data['tables'])}',
                '{$this->escapeCharacters($data['type'])}',
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

    private function selectAssociateQuery($data) {
        return "
            SELECT 
                vc.vendorConnectorId,
                u.firstName,
                u.lastName
            FROM
                vendorConnector vc,
                users u
            WHERE
                vc.vendorId = '{$this->escapeCharacters($data['vendorId'])}'
                AND vc.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND vc.type = 'ASSOCIATE'
            ORDER BY
                u.firstName
        ;
      ";
    }
}
?>
