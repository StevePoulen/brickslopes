<?php

  include_once('../models/afols.php');
  include_once('../models/afolMocs.php');

  $afolObj = new Afols();
  $isAfol = $afolObj->verifyAfolByEmail($_POST['email']);

  if ($isAfol == "true") {
    $to = "steve@brickslopes.com, ";
    $to .= "cody@brickslopes.com, ";
    $to .= "brian@brickslopes.com";

    // compose headers
    $headers = "From: cody@brickslopes.com\r\n";
    $headers .= "Reply-To: cody@brickslopes.com\r\n";
    $headers .= "X-Mailer: PHP/".phpversion();

    // compose message
    $message = "";
    foreach ($_POST as $key => $value) {
      $message .= "{$key} => {$value}\n\n";
    }
    $message = wordwrap($message, 70);

    try {
      $afolMocsObj = new AfolMocs();
      $afolMocsObj->setAfolMocInformation($_POST);
    } catch (Exception $e) {
      $message .= "Caught exception => {$e->getMessage()} \n\n";
    }

    $subject = "BricksSlopes Moc Registration";

    // send email
    mail($to, $subject, $message, $headers);
  }

  echo $isAfol;
?>
