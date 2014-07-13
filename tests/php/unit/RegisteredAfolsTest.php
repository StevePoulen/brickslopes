<?php

class RegisteredAfolsTest extends PHPUnit_Framework_TestCase 
{

    public function setUp() 
    {
        $this->userId = 22;
        $this->isAdmin = true;
        new RegisteredAfolsMock();
        include_once('controllers/registeredAfols.php');
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
        $GLOBALS['fetch_object'] = "RegisteredAfolsMock";
        new RegisteredAfols($this->isAdmin);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[2];
        $this->assertEquals($output['eventName'] , 'BrickSlopes - Salt Lake City');
        $afol = $output['registeredAfols'][0];

        $this->assertEquals($afol['registrationId'] , '1');
        $this->assertEquals($afol['comments'] , 'This is a comment');
        $this->assertEquals($afol['firstName'] , 'Brian');
        $this->assertEquals($afol['lastName'] , 'Pilati');
        $this->assertEquals($afol['email'] , 'brianpilati@gmail.com');
        $this->assertEquals($afol['city'] , 'Spanish Fork');
        $this->assertEquals($afol['state'] , 'Utah');
        $this->assertEquals($afol['paid'] , 'NO');
        $this->assertEquals(sizeOf($afol), 10);

        $total = $output['registeredAfols'][0]['lineItems']['total'];
        $this->assertEquals($total , 25.00);

        $lineItems = $output['registeredAfols'][0]['lineItems']['lineItems'][0];
        $this->assertEquals($lineItems['lineItem'] , 'T-Shirt');
    }

    public function testAuthenticatedGETAsNonAdmin() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $_GET['eventId'] = 2;
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "RegisteredAfolsMock";
        new RegisteredAfols(false);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[2];
        $this->assertEquals($output['eventName'] , 'BrickSlopes - Salt Lake City');
        $afol = $output['registeredAfols'][0];

        $this->assertEquals($afol['registrationId'] , '1');
        $this->assertEquals($afol['firstName'] , 'Brian');
        $this->assertEquals($afol['lastName'] , 'Pilati');
        $this->assertEquals($afol['city'] , 'Spanish Fork');
        $this->assertEquals($afol['state'] , 'Utah');
        $this->assertEquals(sizeOf($afol), 6);
    }
}
