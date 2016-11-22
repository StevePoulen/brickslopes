<?php

class RegisteredEventDatesTest extends PHPUnit_Framework_TestCase
{
    public function setUp() 
    {
        include_once('controllers/admin/eventDates.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new RegisteredEventDates();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array (
            'eventId' => '123445'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new RegisteredEventDates();
        $this->assertEquals(http_response_code(), 200);

        $output = json_decode(get_ob(), true);
        $this->assertEquals($output[0]['eventDatesId'] , '1');
        $this->assertEquals($output[0]['eventId'] , '2');
        $this->assertEquals($output[0]['startDate'] , '2014-05-16 08:00:00Z');
        $this->assertEquals($output[0]['endDate'] , '2014-05-16 20:00:00Z');
        $this->assertEquals($output[0]['type'] , 'AFOL');

        $this->assertEquals($output[1]['eventDatesId'] , '2');
        $this->assertEquals($output[1]['eventId'] , '2');
        $this->assertEquals($output[1]['startDate'] , '2015-05-16 08:00:00Z');
        $this->assertEquals($output[1]['endDate'] , '2015-05-16 20:00:00Z');
        $this->assertEquals($output[1]['type'] , 'PUBLIC');
    }
}
