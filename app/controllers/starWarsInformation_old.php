<?php

include_once('../models/starWars.php');

$starWarsObj = new StarWars();

$reservedCount = $starWarsObj->getReservedStarWarsSetsCount();
$availableCount = $starWarsObj->getAvailableStarWarsSetsCount();
$totalCount = $reservedCount + $availableCount;

$starWarsObj->selectAllStarWarsSets();
?>
