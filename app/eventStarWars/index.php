<?php include_once '../includes/brickSlopesLogo.html'; ?> 
<?php include_once '../controllers/starWarsInformation.php'; ?> 

<script type="text/javascript" src="/js/googleAnalytics.js"></script>

<h1><?php createBrickSlopesLogo("1.25"); ?> &#8226; <?php stylizePages("Star Wars - Build The Empire");?></h1>
<p>
<?php
  echo "
    <div class='starWarsTally'>
      <div class='starWarsTallyText'>
  ";
  createBrickSlopesLogo("1.25");
  echo " is calling all AFOL's to bring their favorite Star Wars sets to display as one giant, complete collection! 
      </div>
      <div class='individualStarWarsTally'>
        Available Sets: {$availableCount}
      </div>
      <div class='individualStarWarsTally'>
        Reserved Sets: {$reservedCount}
      </div>
      <div class='individualStarWarsTally'>
        Total Sets: {$totalCount}
      </div>
    </div>
  ";
?>

<div class="mainStarWarsContainer">
  <div id="reserveStarWarsSet" style="display: none;">
    <span id="dashboardText"></span>
    <div id="reserveCloseButton"></div>
  </div>


<?php
  if ($starWarsObj->result) {
    $counter=0;
    while($dbObj = $starWarsObj->result->fetch_object()){
      $backgroundClass = ($counter % 4 < 2 ? "evenStarWarsBackground" : "oddStarWarsBackground");
      $counter++;

      $reserved = "Available, click to reserve";
      $reservedBackground = "starWarsAvailableBackground";
      if ($dbObj->reserved != "") {
        $reserved = "Reserved";
        $reservedBackground = "starWarsReservedBackground";
      }
      echo "
        <div class='singleStarWarsContainer {$backgroundClass}'>
          <div class='starWarsImageContainer'>
            <div>
              <img class='starWarsImage' src='{$dbObj->image}'>
            </div>
          </div>
          <div class='starWarsTextContainer'>
            <div>
              <span class='starWarsFont'>(#{$counter})</span>
              <span class='starWarsFont bold'>
                {$dbObj->setId} {$dbObj->description}
              </span>
            </div>
            <div>
              {$dbObj->year} {$dbObj->genre}
            </div>
            <div class='starWarsReserved $reservedBackground' id='{$dbObj->starWarsSetsId}'>$reserved</div>
          </div>
        </div>
      ";
    }
  }
?>
</div>
<p>
