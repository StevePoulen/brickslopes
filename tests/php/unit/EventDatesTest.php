<?php

class EventDatesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 1;
        $this->eventDatesMock = new EventDatesMock();
        include_once('controllers/eventDates.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new eventDates();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET['eventId'] = 2;
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $this->eventDatesMock->buildGlobalVariables();
        $GLOBALS['fetch_object'] = new EventDatesMock();
        new eventDates();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['2']['startDate'] , '2014-05-16 08:00:00');
        $this->assertEquals($output['2']['endDate'] , '2014-05-16 20:00:00');
        $this->assertEquals($output['2']['type'] , 'AFOL');
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        new EventDates();
        $this->assertEquals(http_response_code(), 400);
    }
}
