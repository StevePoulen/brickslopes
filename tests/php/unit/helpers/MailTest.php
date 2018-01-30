<?php

class MailTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        include_once('lib/mail.php');
    }

    public function testSendVendorRegistrationMessage() 
    {
        $GLOBALS['db_query'] = '1';
        $mailObj = new mail(15);
        $mailObj->sendVendorRegistrationMessage(1,2);
        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Vendor Registration');
        $this->assertEquals($emailOutput['creatorId'], 15);
        $this->assertEquals($emailOutput['recipientId'], '123456789');
        $this->assertEquals($emailOutput['type'], 'mail::sendVendorRegistrationMessage');
        $this->assertEquals($emailOutput['priority'], 4);
        $this->assertEquals($emailOutput['emailAddress'], 'brianpilati@gmail.com');
        $this->assertContains('you have submitted a request to be a vendor', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
    }

    public function testSendVendorContactMessage()
    {
        $GLOBALS['db_query'] = '1';
        $mailObj = new mail(15);
        $dto = array(
            'businessName' => 'business Name'
        );
        $mailObj->sendVendorContactMessage($dto);
        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Vendor Request');
        $this->assertEquals($emailOutput['creatorId'], 15);
        $this->assertEquals($emailOutput['recipientId'], '1');
        $this->assertEquals($emailOutput['type'], 'mail::sendVendorContactMessage');
        $this->assertEquals($emailOutput['priority'], 10);
        $this->assertEquals($emailOutput['emailAddress'], 'undetermined');
        $this->assertContains('BrickSlopes Vendor Request', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
    }
}
