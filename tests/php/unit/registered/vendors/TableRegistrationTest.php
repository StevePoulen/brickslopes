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
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 2);

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

        $lineItemObj = $GLOBALS['addRegistrationLineItems'][1];
        $this->assertEquals($lineItemObj['eventLineItemCodeId'], 10);
        $this->assertEquals($lineItemObj['eventId'], 2);
        $this->assertEquals($lineItemObj['userId'], 5);
        $this->assertEquals($lineItemObj['lineItem'], 'Vendor Tables');
        $this->assertEquals($lineItemObj['amount'], '75.00');
        $this->assertEquals($lineItemObj['paid'], 'NO');
        $this->assertEquals($lineItemObj['discount'], 'YES');
        $this->assertEquals($lineItemObj['description'], null);
        $this->assertEquals($lineItemObj['size'], null);
        $this->assertEquals($lineItemObj['quantity'], 12);
        $this->assertEquals($lineItemObj['active'], 'YES');
        $this->assertEquals(sizeOf($lineItemObj), 11);
    }
}
