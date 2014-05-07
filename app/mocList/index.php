<?php include_once '../includes/brickSlopesLogo.html'; ?> 

                  <h1><?php createBrickSlopesLogo("1.25"); ?> &#8226; <?php stylizePages("MOCs and Builders"); ?></h1>
                  <p>
<div class='mocListContainer'>
  <?php
    if ($afolMocsObj->result) {
      $counter=0;
      while($dbObj = $afolMocsObj->result->fetch_object()){
        $backgroundClass = ($counter % 2 ? "evenMocList" : "oddMocList");
        $counter++;
        echo "
          <div class='singleMocListContainer $backgroundClass'>
            <div class='mocListTitle'>{$dbObj->title}</div>
            <div class='mocListBuilder'>
              <span class='bold'>{$dbObj->firstName} {$dbObj->lastName}</span>
              <br>
              Baseplate Size: {$dbObj->baseplateWidth} x {$dbObj->baseplateDepth}
            </div>
          </div>
        ";

      }

    }
  ?>
</div>
<p>
