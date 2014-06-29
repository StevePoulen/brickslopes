<?php

class RegistrationLineItemsTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/registrationLineItems.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "patch";
        new RegistrationLineItems();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['fetch_object'] = "RegistrationLineItemsMock";
        $this->userId = 12345;
        new RegistrationLineItems();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)['2'];
        $this->assertEquals($output[0]['lineItem'] , 'Event Pass');
        $this->assertEquals($output[0]['amount'] , '65.00');
        $this->assertEquals($output[0]['paid'] , 'YES');
        $this->assertEquals($output[0]['discount'] , 'NO');
        $this->assertEquals($output[0]['description'] , 'This is cool');
        $this->assertEquals($output[0]['size'] , '');
        $this->assertEquals($output[0]['quantity'] , '1');
        $this->assertEquals($output[0]['active'] , 'YES');
        $this->assertEquals($output[0]['entryDate'] , '2014-06-29 08:46:00');

        $this->assertEquals($output[1]['lineItem'] , 'Event Pass');
        $this->assertEquals($output[1]['amount'] , '65.00');
        $this->assertEquals($output[1]['paid'] , 'YES');
        $this->assertEquals($output[1]['discount'] , 'NO');
        $this->assertEquals($output[1]['description'] , 'This is cool');
        $this->assertEquals($output[1]['size'] , '');
        $this->assertEquals($output[1]['quantity'] , '');
        $this->assertEquals($output[1]['active'] , '');
        $this->assertEquals($output[1]['entryDate'] , '2014-05-16 08:46:00');
    }
}
