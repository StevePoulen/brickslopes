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
        $output = json_decode(ob_get_contents(), true)['data'];
        $this->assertEquals($output['name'], 'BrickSlopes 2015');
        $this->assertEquals($output['city'], 'Salt Lake City');
        $this->assertEquals($output['state'], 'Utah');
        $this->assertEquals($output['year'], '2015');

        $lineItems = $output['lineItems'];
        $this->assertEquals($lineItems['Event Cost']['cost'], '65.00');
        $this->assertEquals($lineItems['Event Cost']['discount'], '60.00');
        $this->assertEquals($lineItems['Event Cost']['active'], 'YES');
        $this->assertEquals($lineItems['Event Cost']['lineItem'], 'Event Cost');

        $this->assertEquals($lineItems['T-Shirt']['cost'], '25.00');
        $this->assertEquals($lineItems['T-Shirt']['discount'], '20.00');
        $this->assertEquals($lineItems['T-Shirt']['active'], 'YES');
        $this->assertEquals($lineItems['T-Shirt']['lineItem'], 'T-Shirt');
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
