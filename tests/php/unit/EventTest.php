<?php

class EventTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 1;
        $this->eventsMock = new EventsMock();
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
        $GLOBALS['fetch_object'] = "EventsMock";
        $event = new Event();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents());
        $this->assertEquals($output->data->name, 'BrickSlopes 2015');
        $this->assertEquals($output->data->city, 'Salt Lake City');
        $this->assertEquals($output->data->state, 'Utah');
        $this->assertEquals($output->data->year, '2015');
        $this->assertEquals($output->data->cost, '65.00');
        $this->assertEquals($output->data->discount, '60.00');
        $this->assertEquals($output->data->meetAndGreetCost, '15.00');
        $this->assertEquals($output->data->meetAndGreetDiscount, '10.00');
        $this->assertEquals($output->data->discountDate, '2014-06-05 23:59:59');
        $this->assertEquals($output->data->tShirtCost, '20.00');
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
