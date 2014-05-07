<?php
  include_once('../models/afolMocs.php');

  $afolMocsObj = new AfolMocs();
  $afolMocsObj->selectAllAfolMocs();

  include_once('../mocList/index.php');
?>
