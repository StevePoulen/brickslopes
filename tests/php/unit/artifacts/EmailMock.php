<?php

class Mail {
    public function __construct() { }

    public function sendResetEmailMessage($a, $b) {
        $GLOBALS['sendResetEmailMessage_password'] = $b;
    }
}
?>
