<?php
  $to = "steve@brickslopes.com, ";
  $to .= "cody@brickslopes.com, ";
  $to .= "brian@brickslopes.com";

  $subject = "{$_POST['subject']}";

  if ($subject == "") {
    exit;
  }

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

  if (array_key_exists("isRegistration",$_POST)) {
    try {
      include_once('../models/afols.php');

      $afolsObj = new Afols();
      $afolsObj->setAfolInformation($_POST);
    } catch (Exception $e) {
      $message .= "Caught exception => {$e->getMessage()} \n\n";
    }
    $additionalHook = "?meetAndGreet={$_POST['meetAndGreet']}";
  } else {
    $additionalHook = "";
  }

  // send email
  mail($to, $subject, $message, $headers);
  echo "{$_POST['referPage']}{$additionalHook}";
?>
