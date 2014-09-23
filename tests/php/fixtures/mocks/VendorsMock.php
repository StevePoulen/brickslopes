<?php

class vendorModel extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new VendorsMock();
        parent::__construct();
    }

    public function getVendorInformation($data) {
        return $this->query();
    }

    public function deleteAssociate($data) {
        return $this->query();
    }

    public function getVendorStoreInformation($data) {
        return $this->query();
    }

    public function getEventTableInformation($data) {
        return $this->query();
    }

    public function addStoreInformation($data) {
        return $this->query();
    }

    public function editStoreInformation($data) {
        return $this->query();
    }

    public function addTableInformation($data) {
        return $this->query();
    }

    public function editTableInformation($data) {
        return $this->query();
    }

    public function getTableInformation($data) {
        return $this->query();
    }

    public function getStoreEventUserInformation($data) {
        return $this->query();
    }

    public function addStoreEventUserInformation($data) {
        return $this->query();
    }
}

class VendorsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('vendorsDB.txt');
    }

    public function storeId() { return $this->getData(0); }
    public function vendorId() { return $this->getData(0); }
    public function name() { return $this->getData(1); }
    public function description() { return $this->getData(2); }
    public function url() { return $this->getData(3); }
    public function logo() { return $this->getData(4); }
    public function tables() { return $this->getData(5); }
    public function associateId() { return $this->getData(6); }
    public function firstName() { return $this->getData(7); }
    public function lastName() { return $this->getData(8); }
    public function eventId() { return $this->getData(9); }
    public function tableId() { return $this->getData(10); }
    public function creationDate() { return $this->getData(11); }
    public function lineItem() { return $this->getData(12); }
}
?>
