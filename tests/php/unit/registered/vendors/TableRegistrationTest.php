<?php

class TableRegistrationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        include_once('controllers/registered/vendors/tableRegistration.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        new TableRegistration($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array('tableId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new TableRegistration($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $tables = json_decode(get_ob(), true);
        $output = $tables;
        $this->assertEquals($output['storeId'], '1');
        $this->assertEquals($output['eventId'], '245');
        $this->assertEquals($output['tableId'], '56789');
        $this->assertEquals($output['tables'], '12');
        $this->assertEquals(sizeOf($tables), 4);
    }

    public function testAuthenticatedGETNoData() 
    {
        $_GET = array('tableId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = '1';
        new TableRegistration($this->userId);
        $this->assertEquals(http_response_code(), 412);
    }

    public function testAuthenticatedPOST() 
    {
        $_POST = array(
            'eventId' => 2,
            'storeId' => 1567,
            'name' => "A Boy's Mission",
            'tables' => 12 
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = '1456';
        new TableRegistration($this->userId);
        $output = json_decode(get_ob(), true);
        $this->assertEquals(http_response_code(), 201);
        $this->assertEquals($output['storeId'], '1567');

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 4);

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
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 7);
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
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][2];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 10);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], '1st Vendor Table');
        $this->assertEquals($lineItemObj['amount'], '101.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][3];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 12);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Additional Vendor Tables');
        $this->assertEquals($lineItemObj['amount'], '76.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 11);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Verify Emails
        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][0]['type'], 'mail::sendVendorRegistrationMessage');
        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][0]['subject'], 'BrickSlopes Vendor Registration');
        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][0]['emailAddress'], 'brianpilati@gmail.com');
    }

    public function testAuthenticatedPOSTAsExisting() 
    {
        $_POST = array(
            'eventId' => 2,
            'storeId' => 1567,
            'name' => "A Boy's Mission",
            'tables' => 7 
        );
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_results'] = array('15', 'duplicate');
        $GLOBALS['db_query'] = array(true, 'duplicate');
        new TableRegistration($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);

        $this->assertEquals($output['storeId'], '1567');

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);

        //First Table
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], '10');
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], '1st Vendor Table');
        $this->assertEquals($lineItemObj['amount'], '101.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati');
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Remaining Tables
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 12);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Additional Vendor Tables');
        $this->assertEquals($lineItemObj['amount'], '76.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], 'Brian Pilati'); 
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 6);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][1]['type'], 'mail::sendVendorRegistrationMessage');
        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][1]['subject'], 'BrickSlopes Vendor Registration');
        $this->assertEquals($GLOBALS['addEmailHistoryInformation'][1]['emailAddress'], 'blackdragon5555@yahoo.com');
    }

    public function testAuthenticatedPATCH() 
    {
        $_POST = array(
            'eventId' => 2,
            'storeId' => 1567,
            'name' => "A Boy's Mission",
            'tables' => 12 
        );
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_query'] = '1456';
        new TableRegistration($this->userId);
        $output = get_ob();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals($output, 200);

        //Total Line Items
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);

        //First Table
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 10);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], '1st Vendor Table');
        $this->assertEquals($lineItemObj['amount'], '101.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null); 
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 1);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);

        //Remaining Tables
        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 12);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Additional Vendor Tables');
        $this->assertEquals($lineItemObj['amount'], '76.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null); 
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 11);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals($lineItemObj['isOwner'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 12);
    }
}
