<?php
$to = "steve@brickslopes.com, ";
$to .= "cody@brickslopes.com, ";
$to .= "brian@brickslopes.com";

$subject = "{$_POST['subject']}";

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

$additionalHook = (array_key_exists("isRegistration",$_POST) ? "?meetAndGreet={$_POST['meetAndGreet']}" : "");

#print_r($message);

// send email
mail($to, $subject, $message, $headers);
header( "Location: {$_POST['referPage']}{$additionalHook}" );
?>
