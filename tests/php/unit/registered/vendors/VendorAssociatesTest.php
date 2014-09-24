<?php

class VendorAssociatesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        include_once('controllers/registered/vendors/vendorAssociates.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $allAssociates = json_decode(get_ob(), true);
        $output = $allAssociates[0];
        $this->assertEquals($output['associateId'], '123');
        $this->assertEquals($output['firstName'], "Ember");
        $this->assertEquals($output['lastName'], 'Pilati');
        $this->assertEquals($output['lineItem'], 'Associate Pass');
        $this->assertEquals(sizeOf($allAssociates), 1);

    }

    public function testAuthenticatedDELETE() 
    {
        $_GET = array(
            'eventId' => 2, 
            'associateId' => 22
        );
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        $GLOBALS['db_query'] = '1';
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 200);
    }

    public function testAuthenticatedDELETEError() 
    {
        $_GET = array(
            'eventId' => 2, 
            'associateId' => 22
        );
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        $GLOBALS['db_query'] = 0;
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 400);
    }

    public function testAuthenticatedPOSTNotAUserNoPass() 
    {
        $_POST = array(
            'eventId' => 2,
            'addAfolPass' => 'NO',
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com'
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = 1234;
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['associateId'], '1234');
        $this->assertEquals($output['firstName'], 'Cody');
        $this->assertEquals($output['lastName'], 'Ottley');
        $this->assertEquals($output['lineItem'], 'Associate Pass');

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '13');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Associate Pass');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '13');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Associate Pass');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);
        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes User Registration');
        $this->assertContains('registered member of BrickSlopes', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
    }

    public function testAuthenticatedPOSTNotAUserWithPass() 
    {
        $_POST = array(
            'eventId' => 2,
            'addAfolPass' => 'YES',
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com',
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = 1234;
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['associateId'], '1234');
        $this->assertEquals($output['firstName'], 'Cody');
        $this->assertEquals($output['lastName'], 'Ottley');
        $this->assertEquals($output['lineItem'], '4 Day Event Pass');

        //Event Pass - Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Badge Brick - Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Event Pass - Associate 
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Badge Bric - Associatek
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);

        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes User Registration');
        $this->assertContains('registered member of BrickSlopes', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
    }

    public function testAuthenticatedPOSTWithUserNoPass() 
    {
        $_POST = array(
            'eventId' => 2,
            'addAfolPass' => 'NO',
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com'
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = array(false, true, true, true, true, true, 1234);
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['associateId'], '1234');
        $this->assertEquals($output['firstName'], 'Brian');
        $this->assertEquals($output['lastName'], 'Pilati');
        $this->assertEquals($output['lineItem'], 'Associate Pass');

        //Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '13');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Associate Pass');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '13');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Associate Pass');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);
        $this->assertEquals(ISSET($GLOBALS['addEmailHistoryInformation']), false);
    }

    public function testAuthenticatedPOSTWithUserWithPass() 
    {
        $_POST = array(
            'eventId' => 2,
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com',
            'addAfolPass' => 'YES'
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = array(false, true, true, true, true, true, true, true, 1234);
        new VendorAssociates($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['associateId'], '1234');
        $this->assertEquals($output['firstName'], 'Brian');
        $this->assertEquals($output['lastName'], 'Pilati');
        $this->assertEquals($output['lineItem'], '4 Day Event Pass');

        //Event Pass - owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Badge Brick - owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'NO');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Event Pass - associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Badge Brick - associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '6.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);
        $this->assertEquals(ISSET($GLOBALS['addEmailHistoryInformation']), false);
    }

    public function testAuthenticatedPOSTAsSelf() 
    {
        $_POST = array(
            'eventId' => 2,
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com',
            'addAfolPass' => 'YES'
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = array(false, true, true, true, true, true, true, true, 5);
        new VendorAssociates(123456789);
        $this->assertEquals(http_response_code(), 412);
        $output = json_decode(get_ob(), true);

        $this->assertEquals($output['error'], 'selfie');

        //Total Line Items
        $this->assertEquals(ISSET($GLOBALS['addRegistrationLineItems']), false);

        //No Emails
        $this->assertEquals(ISSET($GLOBALS['addEmailHistoryInformation']), false);
    }

    public function testAuthenticatedPOSTAsExisting() 
    {
        $_POST = array(
            'eventId' => 2,
            'firstName' => 'Cody',
            'lastName' => 'Ottley',
            'email' => 'cody@brickslopes.com',
            'addAfolPass' => 'YES'
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_results'] = array('duplicate', true, 'duplicate');
        $GLOBALS['db_query'] = array(false, true, 'duplicate');
        new VendorAssociates(555);
        $this->assertEquals(http_response_code(), 412);
        $output = json_decode(get_ob(), true);

        $this->assertEquals($output['error'], 'existing registrar');

        //Total Line Items
        $this->assertEquals(ISSET($GLOBALS['addRegistrationLineItems']), false);

        //No Emails
        $this->assertEquals(ISSET($GLOBALS['addEmailHistoryInformation']), false);
    }
}
