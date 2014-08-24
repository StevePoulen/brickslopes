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
        $this->assertEquals(sizeOf($allAssociates), 1);

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

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '11');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '11');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);
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

        //Event Pass - Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Badge Brick - Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Event Pass - Associate 
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Badge Bric - Associatek
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 1234);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Cody Ottley');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);
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

        //Owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '11');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '11');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);
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

        //Event Pass - owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '60.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Badge Brick - owner
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Event Pass - associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '1');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Pass');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Badge Brick - associate
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '7');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 123456789);
        $this->assertEquals($lineItemObj['lineItem'], 'Event Badge Brick');
        $this->assertEquals($lineItemObj['amount'], '0.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);
    }
}
