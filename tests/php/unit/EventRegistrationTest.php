<?php

class EventRegistrationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/eventRegistration.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "patch";
        new EventRegistration();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['fetch_object'] = "RegistrationsMock";
        $this->userId = 12345;
        new EventRegistration();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[0];
        $this->assertEquals($output['badgeLine1'] , 'This is great');
        $this->assertEquals($output['badgeLine2'] , 'too cool bro!');
        $this->assertEquals($output['meetAndGreet'] , 'YES');
        $this->assertEquals($output['ageVerification'] , 'YES');
        $this->assertEquals($output['tShirtSize'] , 'X-LARGE');
        $this->assertEquals($output['paid'] , 'NO');
        $this->assertEquals($output['name'] , 'BrickSlopes - SLC');
    }

    public function testAuthenticatedGetNoRegistration() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 12345;
        new EventRegistration();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals(sizeof($output) , 0);
    }

    public function testAuthenticatedPost() 
    {
        $_POST = array (
            'eventId' => '2',
            'discountDate' => '2015-05-16 08:00:00',
            'eventDiscount' => '60.00',
            'meetAndGreetDiscount' => '10.00',
            'meetAndGreet' => 'YES',
            'tShirtDiscount' => '15.00',
            'tShirtSize' => 'X-Large'
        );
        $this->userId = 12345;
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = 12345;
        $eventRegistration = new EventRegistration($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $this->expectOutputString('');
    }

    public function testAuthenticatedPostFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = NULL;
        $eventRegistration = new EventRegistration();
        $this->assertEquals(http_response_code(), 400);
    }
}
