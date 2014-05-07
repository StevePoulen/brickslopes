<?php include_once '../includes/brickSlopesLogo.html'; ?> 

                  <h1><?php createBrickSlopesLogo("1.25"); ?> &#8226; <?php stylizePages("Who's Coming"); ?></h1>
                  <p>
<div>
  <table class='guestList'>
  <?php
    if ($afolsObj->result) {
      $counter=0;
      while($dbObj = $afolsObj->result->fetch_object()){
        echo "
          <tr><td class='guestListName'>{$dbObj->firstName} {$dbObj->lastName}</td><td class='guestListState'>{$dbObj->city}, {$dbObj->state}</td></tr>
        ";

      }

    }
  ?>
  </table>
</div>
<p>
