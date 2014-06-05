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
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $this->eventsMock->buildGlobalVariables();
        $GLOBALS['fetch_object'] = new EventsMock();
        $event = new Event();
        $this->assertEquals(http_response_code(), 200);
        //$output = json_decode(ob_get_contents());
        //echo $output->data->name;
        $this->expectOutputString($this->eventsMock->buildJsonString()); 
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
