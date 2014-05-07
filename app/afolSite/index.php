<?php include_once '../includes/brickSlopesLogo.html'; ?> 
<?php include_once '../includes/vendorCount.html'; ?>

<?php 
  include_once '../models/afolMocs.php'; 
  $afolMocsObj = new AfolMocs();
  $afolMocs = $afolMocsObj->selectAllAfolMocs();
?>

<?php 
  include_once '../models/starWars.php'; 
  $starWarsObj = new StarWars();
  $reservedStarWarsSets = $starWarsObj->getReservedStarWarsSetsCount();
?>

<?php 
  include_once '../models/afols.php'; 
  $afolObj = new Afols();
  $attendingAfols = $afolObj->selectAllAfols();
?>

<?php 
  include_once '../models/vendors.php'; 
  $vendorObj = new Vendors();
  $attendingVendors = $vendorObj->selectAllVendors();
?>


<meta charset="utf-8">
<html>
    <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/ico">
        <link rel="shortcut icon" href="/favicon.ico" type="image/ico">
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=9" />

        <title>BrickSlopes - A LEGO Fan Event</title>

<?php include_once '../includes/javascript.html'; ?>

    </head>
    <body>
        <div id="brickslopes">
<?php include_once '../includes/header.html'; ?>
            <div id="eventDashboard" style="display: none">
              <span id="dashboardText"></span>
              <div id="dashboardCloseButton"></div>
            </div>
            <div id="dashboard">
              <div id="panes">
                <div class="eventPane" id="clickRegistration">
                  <div class="eventImage afolPane"><?php echo createBrickSlopesText('Registration', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Join us May, 2*0*1*4","Register Now"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickSchedule">
                  <div class="eventImage schedulePane"><?php echo createBrickSlopesText('Schedule of Events', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Jammed Pack", "Every Day"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickKeynote">
                  <div class="eventImage keynotePane"><?php echo createBrickSlopesText('Keynote Speaker', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Mr. G-Snot", "Gary Mc*Intyre"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickStarWars">
                  <div class="eventImage starWarsPane"><?php echo createBrickSlopesText('Star Wars<br>' . $reservedStarWarsSets . " Sets Reserved", 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Every Set", "From Every Year"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickMocRegistration">
                  <div class="eventImage mocRegistrationPane"><?php echo createBrickSlopesText('MOC Registration', 1.25 , 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Bring your MOCs", "Display & Share"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickMocList">
                  <div class="eventImage mocListPane"><?php echo createBrickSlopesText('Moc List<br>' . $afolMocs, 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("The Who's Who", "of MOCs"); ?></div>
                   <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickVendors">
                  <div class="eventImage vendorsPane">
                    <?php echo createBrickSlopesText('Vendors<br>' . $attendingVendors, 1.25, 'whiteFont'); ?>
                  </div>
                  <div class="eventText" style="display: none"><?php stylizeText("The Best Vendors", "Find out now ..."); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickGuests">
                  <div class="eventImage volunteersPane">
                    <?php 
                      echo createBrickSlopesText('AFOLS Attendees<br>' . $attendingAfols, 1.25, 'whiteFont'); 
                    ?>
                  </div>
                  <div class="eventText" style="display: none"><?php stylizeText("The Best Builders", "Find out now ..."); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickFaq">
                  <div class="eventImage faqPane"><?php echo createBrickSlopesText('F*A*Q', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Have Questions?", "Get Answers"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickVenue">
                  <div class="eventImage amenitiesPane"><?php echo createBrickSlopesText('Map of Ammenities', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("South Towne Expo", "Sandy, Utah"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane" id="clickHotel">
                  <div class="eventImage hotelPane"><?php echo createBrickSlopesText('Hotel', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Hotel Options"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
                <div class="eventPane">
                  <div class="eventImage travelPane"><?php echo createBrickSlopesText('Travel', 1.25, 'whiteFont'); ?></div>
                  <div class="eventText" style="display: none"><?php stylizeText("Flying or Driving", "SLC or I-1*5"); ?></div>
                  <div class="eventBrickSlopesLogo" style="display: none"></div>
                </div> 
              </div>
            </div>
<?php include_once '../includes/footer.html'; ?>
        </div>
    </body>
</html>

