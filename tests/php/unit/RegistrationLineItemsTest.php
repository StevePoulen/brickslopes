<?php

class RegistrationLineItemsTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        new RegistrationLineItemsMock();
        $this->userId = null;
        include_once('controllers/registrationLineItems.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "patch";
        new RegistrationLineItems(22,true);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['fetch_object'] = "RegistrationLineItemsMock";
        $this->userId = 12345;
        new RegistrationLineItems($this->userId, true);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)['2'];
        $lineItems = $output['lineItems'];

        $this->assertEquals($output['total'], '141.50');

        $this->assertEquals($lineItems[0]['registrationLineItemId'] , 1);
        $this->assertEquals($lineItems[0]['lineItem'] , 'Event Pass');
        $this->assertEquals($lineItems[0]['amount'] , '65.00');
        $this->assertEquals($lineItems[0]['total'] , '65.00');
        $this->assertEquals($lineItems[0]['paid'] , 'YES');
        $this->assertEquals($lineItems[0]['discount'] , 'NO');
        $this->assertEquals($lineItems[0]['description'] , 'This is cool');
        $this->assertEquals($lineItems[0]['size'] , '');
        $this->assertEquals($lineItems[0]['quantity'] , '1');
        $this->assertEquals($lineItems[0]['active'] , 'YES');
        $this->assertEquals($lineItems[0]['entryDate'] , '2014-06-29 08:46:00');

        $this->assertEquals($lineItems[1]['registrationLineItemId'] , 2);
        $this->assertEquals($lineItems[1]['lineItem'] , 'T-Shirt');
        $this->assertEquals($lineItems[1]['amount'] , '15.75');
        $this->assertEquals($lineItems[1]['total'] , '31.50');
        $this->assertEquals($lineItems[1]['paid'] , 'NO');
        $this->assertEquals($lineItems[1]['discount'] , 'YES');
        $this->assertEquals($lineItems[1]['description'] , '');
        $this->assertEquals($lineItems[1]['size'] , 'X-Large');
        $this->assertEquals($lineItems[1]['quantity'] , '2');
        $this->assertEquals($lineItems[1]['active'] , 'YES');
        $this->assertEquals($lineItems[1]['entryDate'] , '2014-06-29 08:46:00');
    }

    public function testBuildLineItemObject() 
    {
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['fetch_object'] = "RegistrationLineItemsMock";
        $registrationLineItem = new RegistrationLineItems();
        $output = $registrationLineItem->getRegisteredLineItems(1,2);
        $lineItems = $output['lineItems'];

        $this->assertEquals($output['total'], '141.50');

        $this->assertEquals($lineItems[0]['registrationLineItemId'] , 1);
        $this->assertEquals($lineItems[0]['lineItem'] , 'Event Pass');
        $this->assertEquals($lineItems[0]['amount'] , '65.00');
        $this->assertEquals($lineItems[0]['paid'] , 'YES');
        $this->assertEquals($lineItems[0]['total'] , '65.00');
        $this->assertEquals($lineItems[0]['discount'] , 'NO');
        $this->assertEquals($lineItems[0]['description'] , 'This is cool');
        $this->assertEquals($lineItems[0]['size'] , '');
        $this->assertEquals($lineItems[0]['quantity'] , '1');
        $this->assertEquals($lineItems[0]['active'] , 'YES');
        $this->assertEquals($lineItems[0]['entryDate'] , '2014-06-29 08:46:00');

        $this->assertEquals($lineItems[1]['registrationLineItemId'] , 2);
        $this->assertEquals($lineItems[1]['lineItem'] , 'T-Shirt');
        $this->assertEquals($lineItems[1]['amount'] , '15.75');
        $this->assertEquals($lineItems[1]['paid'] , 'NO');
        $this->assertEquals($lineItems[1]['total'] , '31.50');
        $this->assertEquals($lineItems[1]['discount'] , 'YES');
        $this->assertEquals($lineItems[1]['description'] , '');
        $this->assertEquals($lineItems[1]['size'] , 'X-Large');
        $this->assertEquals($lineItems[1]['quantity'] , '2');
        $this->assertEquals($lineItems[1]['active'] , 'YES');
        $this->assertEquals($lineItems[1]['entryDate'] , '2014-06-29 08:46:00');

        $this->assertEquals($lineItems[2]['registrationLineItemId'] , 3);
        $this->assertEquals($lineItems[2]['lineItem'] , 'Meet And Greet');
        $this->assertEquals($lineItems[2]['amount'] , '15.00');
        $this->assertEquals($lineItems[2]['paid'] , 'NO');
        $this->assertEquals($lineItems[2]['total'] , '45.00');
        $this->assertEquals($lineItems[2]['discount'] , 'NO');
        $this->assertEquals($lineItems[2]['description'] , '');
        $this->assertEquals($lineItems[2]['size'] , '');
        $this->assertEquals($lineItems[2]['quantity'] , '3');
        $this->assertEquals($lineItems[2]['active'] , 'NO');
        $this->assertEquals($lineItems[2]['entryDate'] , '2014-06-29 08:46:00');
    }
}
