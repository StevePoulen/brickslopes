<?php

class MailCronProcessTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $GLOBALS['isTest'] = true;
        $GLOBALS['db_query'] = false;
        $GLOBALS['phpmailer_send'] = true;
        include_once('lib/mailCronProcess.php');
        $output = get_ob();
    }

    public function testSendEmailMessage() 
    {
        $GLOBALS['db_query'] = '1';
        new mailCronProcess();
        $output = get_ob();
        $updateHistory = $GLOBALS['updateEmailHistoryInformation'];
        $subject = $GLOBALS['phpmailer_subject'][0];
        $body = $GLOBALS['phpmailer_body'][0];

        $this->assertContains('Starting emails with 1 e-mails', $output);
        $this->assertContains("Sending an email to 'brian@brickslopes.com' with 'This is my subject' Subject", $output);
        $this->assertContains("Email Status is 'SUCCESS'", $output);

        $this->assertEquals($updateHistory['status'], 1);
        $this->assertEquals($updateHistory['errorMessage'], NULL);

        $this->assertEquals($subject, 'This is my subject');
        $this->assertEquals($body, 'This is my body');
    }
}
