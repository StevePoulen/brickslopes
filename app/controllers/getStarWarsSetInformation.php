<?php

  include_once('../models/starWars.php');

  $starWarsObj = new StarWars();
  $starWarsObj->selectStarWarsSetById($_GET['starWarsSetId']);

  include_once('../views/starWarsSetInformation.php');
?>
