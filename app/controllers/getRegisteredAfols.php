<?php
  include_once('../models/afols.php');

  $afolsObj = new Afols();
  $afolsObj->selectAllAfols();

  include_once('../eventGuests/index.php');
?>
