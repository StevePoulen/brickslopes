<?php

class RegisteredAfolsTest extends PHPUnit_Framework_TestCase 
{

    public function setUp() 
    {
        $this->userId = 22;
        $this->isAdmin = true;
        include_once('controllers/registered/registeredAfols.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new RegisteredAfols($this->isAdmin);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGETAsAdmin() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $_GET['eventId'] = 2;
        $GLOBALS['db_query'] = '1';
        new RegisteredAfols($this->isAdmin);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)[2];
        $this->assertEquals($output['eventName'] , 'BrickSlopes - Salt Lake City');
        $afol = $output['registeredAfols'][0];

        $this->assertEquals($afol['registrationId'] , '2');
        $this->assertEquals($afol['userId'] , '2');
        $this->assertEquals($afol['comments'] , 'This is a comment');
        $this->assertEquals($afol['firstName'] , 'Ember');
        $this->assertEquals($afol['lastName'] , 'Pilati');
        $this->assertEquals($afol['email'] , 'ember@brickslopes.com');
        $this->assertEquals($afol['city'] , 'Salem');
        $this->assertEquals($afol['state'] , 'Colorado');
        $this->assertEquals($afol['paid'] , 'NO');
        $this->assertEquals(sizeOf($afol), 10);

        $total = $afol['lineItems']['total'];
        $this->assertEquals($total, 110.00);

        $lineItems = $afol['lineItems']['lineItems'][0];
        $this->assertEquals($lineItems['lineItem'] , 'Event Pass');
    }

    public function testAuthenticatedGETAsNonAdmin() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $_GET['eventId'] = 2;
        $GLOBALS['db_query'] = '1';
        new RegisteredAfols(false);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)[2];
        $this->assertEquals($output['eventName'] , 'BrickSlopes - Salt Lake City');
        $afol = $output['registeredAfols'][0];

        $this->assertEquals($afol['registrationId'] , '2');
        $this->assertEquals($afol['firstName'] , 'Ember');
        $this->assertEquals($afol['lastName'] , 'Pilati');
        $this->assertEquals($afol['city'] , 'Salem');
        $this->assertEquals($afol['state'] , 'Colorado');
        $this->assertEquals(sizeOf($afol), 6);
    }
}
