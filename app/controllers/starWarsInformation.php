<?php

include_once('../models/starWars.php');

$starWarsObj = new StarWars();

$reservedCount = $starWarsObj->getReservedStarWarsSetsCount();
$availableCount = $starWarsObj->getAvailableStarWarsSetsCount();
$totalCount = $reservedCount + $availableCount;

$reservedId = $_GET['filter'] != "" ? $_GET['filter'] : null;

$starWarsObj->selectAllStarWarsSets($reservedId);
?>
