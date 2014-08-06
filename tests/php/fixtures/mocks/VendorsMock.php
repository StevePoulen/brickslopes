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
}

class VendorsMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('vendorsDB.txt');
    }

    public function vendorId() { return $this->getData(0); }
    public function name() { return $this->getData(1); }
    public function description() { return $this->getData(2); }
    public function url() { return $this->getData(3); }
    public function logo() { return $this->getData(4); }
    public function tables() { return $this->getData(5); }
}
?>
