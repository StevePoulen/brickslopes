<?php

class EventTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 1;
        include_once('controllers/event.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        $event = new Event();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new Event();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['eventId'], 2);
        $this->assertEquals($output['name'], 'BrickSlopes 2015');
        $this->assertEquals($output['city'], 'Salt Lake City');
        $this->assertEquals($output['state'], 'Utah');
        $this->assertEquals($output['year'], '2015');
        $this->assertEquals($output['discountDate'], '2015-03-25 14:23:22');

        $lineItems = $output['lineItems']['10001'];
        $this->assertEquals($lineItems['cost'], '65.00');
        $this->assertEquals($lineItems['discount'], '60.00');
        $this->assertEquals($lineItems['active'], 'YES');
        $this->assertEquals($lineItems['lineItem'], 'Event Cost');

        $lineItems = $output['lineItems']['10002'];
        $this->assertEquals($lineItems['cost'], '25.00');
        $this->assertEquals($lineItems['discount'], '20.00');
        $this->assertEquals($lineItems['active'], 'YES');
        $this->assertEquals($lineItems['lineItem'], 'T-Shirt');
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        $event = new Event();
        $this->assertEquals(http_response_code(), 400);
    }
}
