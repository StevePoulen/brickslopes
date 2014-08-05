<?php

class MailCronProcessTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $GLOBALS['isTest'] = true;
        $GLOBALS['db_query'] = false;
        include_once('lib/mailCronProcess.php');
    }

    public function testSendEmailMessage() 
    {
        $GLOBALS['db_query'] = '1';
        new mailCronProcess();
        $updateHistory = $GLOBALS['updateEmailHistoryInformation'];
        $subject = $GLOBALS['phpmailer_subject'][0];
        $body = $GLOBALS['phpmailer_body'][0];

        $this->assertEquals($updateHistory['status'], 1);
        $this->assertEquals($updateHistory['errorMessage'], NULL);

        $this->assertEquals($subject, 'This is my subject');
        $this->assertEquals($body, 'This is my body');
    }
}
