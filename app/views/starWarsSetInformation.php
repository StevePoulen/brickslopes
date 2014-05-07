<?php include_once '../includes/brickSlopesLogo.html'; ?> 

<?php
  if ($starWarsObj->result) {
    while($dbObj = $starWarsObj->result->fetch_object()){
      echo "
        <div id='reserveStarWarsSetText' class='starWarsFont'>
          <div class='reservedStarWarsSetDiv'>
            Thank you for helping us
      ";

      stylizePages("Build The Empire");

      echo "by bringing
            <span class='starWarsFont bold'>
              {$dbObj->setId} {$dbObj->description}*
            </span> to ";
            createBrickSlopesLogo("1.25");
      echo "
          </div>
          <div class='reservedStarWarsSetDiv'>
            <img class='starWarsReservedImage' src='{$dbObj->image}'>
          </div>
          <div class='reservedStarWarsSetDiv'>
            Please confirm your reservation with your
            <form>
              <input type='hidden' id='starWarsSetId' value='{$dbObj->starWarsSetsId}'>
              <label id='emailAddressLabel'>e-mail address:</label> <input id='emailAddress' type='text' name='email' size=35>
              <p>
              <input id='starWarsSetRegistrationButton' value='Confirm My Reservation' type='submit'>
            </form> 
          </div>
          <div class='reservedStarWarsSetDiv smallFont'> 
            <label id='starWarsNotRegistered'>
              * You must be registered with a 4-day AFOL event pass to participate. 
            </label>
            <p>
            <div id='starWarsRegisterNow' style='display: none;'><input type=submit value='Register Now'></div>

          </div>
        </div>
      ";
    }
  }
?>
