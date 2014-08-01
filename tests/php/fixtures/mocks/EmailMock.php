<?php

class PHPMailer {
    public function __construct() { }

    public function IsSMTP() {}
    public function AddAddress() {}
    public function isHTML() {}
    public function Send() {}
    public function __set($name, $value) {
        if ($name === 'Subject') {
            if(! ISSET($GLOBALS['phpmailer_subject'])) {
                $GLOBALS['phpmailer_subject'] = array();
            }
            array_push(
                $GLOBALS['phpmailer_subject'],
                $value
            );
        } else if ($name === 'Body') {
            if(! ISSET($GLOBALS['phpmailer_body'])) {
                $GLOBALS['phpmailer_body'] = array();
            }
            array_push(
                $GLOBALS['phpmailer_body'],
                $value
            );
        }
    }
}
?>
