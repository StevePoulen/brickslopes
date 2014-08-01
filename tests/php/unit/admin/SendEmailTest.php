<?php

class SendEmailTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 1;
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
        new SendEmail();
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
        new SendEmail();
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
        new SendEmail();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals($GLOBALS['phpmailer_subject'][0], 'BrickSlopes Registration Complete');
        $this->assertContains('Thank you for your payment.', $GLOBALS['phpmailer_body'][0]);
    }

    public function testPreviewSiteNewsMessage() 
    {
        $_GET = array(
            'userId' => '1',
            'emailBody' => 'Hello World Preview',
            'type' => 'previewSiteNews'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new SendEmail(1);
        $this->assertEquals(http_response_code(), 200);
        $output = get_ob();
        $this->assertContains('Hello World Preview', $output);
        $this->assertContains('Brian', $output);
        $this->assertNotContains('Cody', $output);
    }

    public function testSendSiteNewsMessage() 
    {
        $_GET = array(
            'userId' => '1',
            'emailBody' => 'Hello World Send',
            'type' => 'siteNews'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new SendEmail(1);
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals($GLOBALS['phpmailer_subject'][0], 'BrickSlopes News Announcement');
        $this->assertEquals(sizeOf($GLOBALS['phpmailer_body']), 2);
        $this->assertContains('Hello World Send', $GLOBALS['phpmailer_body'][0]);
        $this->assertContains('Brian', $GLOBALS['phpmailer_body'][0]);
        $this->assertContains('Cody', $GLOBALS['phpmailer_body'][1]);
    }

    public function testSendSiteNewsMessageNotAdmin() 
    {
        $GLOBALS['phpmailer_subject'] = 'Howdy';
        $_GET = array(
            'userId' => '1',
            'type' => 'siteNews'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new SendEmail(2);
        $this->assertEquals(http_response_code(), 412);
        $this->assertEquals($GLOBALS['phpmailer_subject'], 'Howdy');
    }
}
