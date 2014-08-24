<?php

class vendorModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function addStoreInformation($data) {
        $storeId = $this->query($this->insertQuery($data));
        if ($storeId > 0) {
            $data['storeId'] = $storeId;
            $this->query($this->insertVendorConnectorQuery($data));
        }
        return $storeId;
    }

    public function addTableInformation($data) {
        $tableId = $this->query($this->insertStoreEventConnectorQuery($data));
        $this->query($this->insertStoreEventUserConnectorQuery($data));
        return $tableId;
    }

    public function getTableInformation($data) {
        $this->query($this->selectStoreEventConnectorQuery($tableId));
    }

    public function getVendorInformation($eventId) {
        return $this->query($this->selectQuery($eventId));
    }

    public function getVendorStoreInformation($data) {
        return $this->query($this->selectVendorStoreQuery($data));
    }

    public function addStoreEventUserInformation($data) {
        return $this->query($this->insertStoreEventUserConnectorQuery($data));
    }

    public function getStoreEventUserInformation($data) {
        return $this->query($this->selectAssociateQuery($data));
    }

    private function selectStoreEventConnectorQuery($tableId) {
        return "
            SELECT 
                storeEventConnectorId as tableId,
                eventId,
                storeId,
                tables
            FROM
                storeEventConnector sec 
            WHERE
                sec.storeEventConnectorId= '{$this->escapeCharacters($tableId)}'
            ORDER BY
                v.name
        ;
      ";
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

    private function selectVendorStoreQuery($data) {
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
                AND vc.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND vc.userId = '{$this->escapeCharacters($data['userId'])}'
            ORDER BY
                v.name
        ;
      ";
    }

    private function insertStoreEventUserConnectorQuery($data) {
        return "
            INSERT INTO
                storeEventUserConnector
            (
                eventId, 
                storeId, 
                userId, 
                type,
                registrationDate 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['storeId'])}',
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['type'])}',
                now()
          )
        ;
      ";
    }

    private function insertStoreEventConnectorQuery($data) {
        return "
            INSERT INTO
                storeEventConnector
            (
                eventId, 
                storeId, 
                tables,
                registrationDate 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['eventId'])}',
                '{$this->escapeCharacters($data['storeId'])}',
                '{$this->escapeCharacters($data['tables'])}',
                now()
          )
        ;
      ";
    }

    private function insertVendorConnectorQuery($data) {
        return "
            INSERT INTO
                vendorConnector
            (
                userId, 
                storeId, 
                type,
                registrationDate 
            )
        VALUES
          (
                '{$this->escapeCharacters($data['userId'])}',
                '{$this->escapeCharacters($data['storeId'])}',
                '{$this->escapeCharacters($data['type'])}',
                now()
          )
        ;
      ";
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                stores 
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
                seuc.storeEventUserConnectorId,
                u.firstName,
                u.lastName
            FROM
                storeEventUserConnector seuc,
                users u
            WHERE
                seuc.storeId = '{$this->escapeCharacters($data['storeId'])}'
                AND seuc.eventId = '{$this->escapeCharacters($data['eventId'])}'
                AND seuc.type = 'ASSOCIATE'
            ORDER BY
                u.firstName
        ;
      ";
    }
}
?>
