<?php

class MocTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        new MocsMock();
        include_once('controllers/mocs/mocs.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedPOST() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "MocsMock";
        $event = new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 201);
    }

    public function testAuthenticatedPostFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 'Bad Query';
        $event = new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 400);
    }
}
