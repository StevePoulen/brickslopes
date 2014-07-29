<?php

class SendEmailTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        include_once('controllers/admin/sendEmail.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "get";
        new SendEmail();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedBadPayload() 
    {
        $_GET = array(
            'userId' => 1
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new SendEmail();
        $this->assertEquals(http_response_code(), 400);
    }

    public function testAuthenticatedBadType() 
    {
        $_GET = array(
            'userId' => 1,
            'type' => 'unknown'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new SendEmail();
        $this->assertEquals(http_response_code(), 412);
    }

    public function testSendRegistrationPaidMessage() 
    {
        $_GET = array(
            'userId' => 1,
            'eventId' => 2,
            'type' => 'registrationPaid'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new SendEmail();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals($GLOBALS['sendRegistrationPaidMessage'], 1);
    }
}
