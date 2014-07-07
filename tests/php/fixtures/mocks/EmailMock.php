<?php

class Mail {
    public function __construct() { }

    public function sendResetEmailMessage($a, $b) {
        $GLOBALS['sendResetEmailMessage_password'] = $b;
    }

    public function sendRegistrationPaidMessage($a) {
        $GLOBALS['sendRegistrationPaidMessage'] = $a;
    }

    public function sendUserRegistrationMessage($a) {
        $GLOBALS['sendUserRegistrationMessage'] = $a;
    }

    public function sendEventRegistrationMessage($a) {
        $GLOBALS['sendEventRegistrationMessage'] = $a;
    }
}
?>
