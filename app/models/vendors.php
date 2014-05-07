<?php
  require_once('../lib/db.php');

  class Vendors extends db {
    function __construct() {
        parent::__construct();
    }

    public function getAttendingVendors() {
       return $this->query($this->selectQuery());
    }

    public function selectAllVendors() {
       return $this->query($this->selectQuery());
    }

    private function selectQuery() {
      return "
        SELECT
          vendorsId,
          vendor,
          product,
          package,
          contactName,
          tables,
          paid,
          amount,
          booth
        FROM
         vendors
        ORDER BY
          vendorsId
        ;
      ";
    }
  }
?>
