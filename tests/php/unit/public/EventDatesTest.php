<?php

class EventDatesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        include_once('controllers/public/eventDates.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new eventDates();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new eventDates();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)[2];
        $this->assertEquals($output[0]['eventId'] , '2');
        $this->assertEquals($output[0]['startDate'] , '2014-05-16 08:00:00Z');
        $this->assertEquals($output[0]['endDate'] , '2014-05-16 20:00:00Z');
        $this->assertEquals($output[0]['type'] , 'AFOL');

        $this->assertEquals($output[1]['eventId'] , '2');
        $this->assertEquals($output[1]['startDate'] , '2015-05-16 08:00:00Z');
        $this->assertEquals($output[1]['endDate'] , '2015-05-16 20:00:00Z');
        $this->assertEquals($output[1]['type'] , 'PUBLIC');
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
