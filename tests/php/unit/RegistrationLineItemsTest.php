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
        /*
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['fetch_object'] = "RegistrationsMock";
        $this->userId = 12345;
        new RegistrationLineItems();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[0];
        $this->assertEquals($output['badgeLine1'] , 'This is great');
        $this->assertEquals($output['badgeLine2'] , 'too cool bro!');
        $this->assertEquals($output['meetAndGreet'] , 'YES');
        $this->assertEquals($output['ageVerification'] , 'YES');
        $this->assertEquals($output['tShirtSize'] , 'X-LARGE');
        $this->assertEquals($output['paid'] , 'NO');
        $this->assertEquals($output['name'] , 'BrickSlopes - SLC');
        */
    }
}
