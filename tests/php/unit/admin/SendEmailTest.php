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

    public function testSendVendorRegistrationMessage() 
    {
        $_GET = array(
            'userId' => 1,
            'eventId' => 2,
            'type' => 'vendorRegistration'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new SendEmail(15);
        $this->assertEquals(http_response_code(), 200);
        $output = get_ob();
        $this->assertContains('request to be a vendor', $output);
        $this->assertContains('Brian', $output);
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
        new SendEmail(15);
        $this->assertEquals(http_response_code(), 200);
        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Registration Complete');
        $this->assertEquals($emailOutput['creatorId'], 15);
        $this->assertEquals($emailOutput['recipientId'], '123456789');
        $this->assertEquals($emailOutput['type'], 'mail::sendRegistrationPaidMessage');
        $this->assertEquals($emailOutput['priority'], 2);
        $this->assertEquals($emailOutput['emailAddress'], 'brianpilati@gmail.com');
        $this->assertContains('Thank you for your payment', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
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
        $emailOutput = $GLOBALS['addEmailHistoryInformation'];
        $this->assertEquals(sizeOf($emailOutput), 2);
        $this->assertContains('Hello World Send', $emailOutput[0]['body']);
        $this->assertContains('Brian', $emailOutput[0]['body']);
        $this->assertContains('Cody', $emailOutput[1]['body']);

        $this->assertEquals($emailOutput[0]['subject'], 'BrickSlopes News Announcement');
        $this->assertEquals($emailOutput[0]['creatorId'], 1);
        $this->assertEquals($emailOutput[0]['recipientId'], '123456789');
        $this->assertEquals($emailOutput[0]['type'], 'mail::sendSiteNewsMessage');
        $this->assertEquals($emailOutput[0]['priority'], 9);
        $this->assertEquals($emailOutput[0]['emailAddress'], 'brianpilati@gmail.com');
        $this->assertContains('Hello World Send', $emailOutput[0]['body']);

        $this->assertEquals($emailOutput[1]['subject'], 'BrickSlopes News Announcement');
        $this->assertEquals($emailOutput[1]['creatorId'], 1);
        $this->assertEquals($emailOutput[1]['recipientId'], 2);
        $this->assertEquals($emailOutput[1]['type'], 'mail::sendSiteNewsMessage');
        $this->assertEquals($emailOutput[1]['priority'], 9);
        $this->assertEquals($emailOutput[1]['emailAddress'], 'blackdragon5555@yahoo.com');
        $this->assertContains('Hello World Send', $emailOutput[1]['body']);
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
