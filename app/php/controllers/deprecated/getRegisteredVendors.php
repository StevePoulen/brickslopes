<?php
  include_once('../models/vendors.php');

  $vendorsObj = new Vendors();
  $vendorsObj->selectAllVendors();

  include_once('../eventVendors/index.php');
?>
