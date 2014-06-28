<?php

class EventRegistrationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/eventRegistration.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "patch";
        new EventRegistration();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        /*
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['users_userId'] = '12345';
        $this->userId = 12345;
        $eventRegistration = new EventRegistration();
        $this->assertEquals(http_response_code(), 201);
        $this->expectOutputString('');
        */
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = 12345;
        $GLOBALS['users_userId'] = '12345';
        $this->userId = 12345;
        $eventRegistration = new EventRegistration();
        $this->assertEquals(http_response_code(), 201);
        $this->expectOutputString('');
    }

    public function testAuthenticatedPostFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = NULL;
        $eventRegistration = new EventRegistration();
        $this->assertEquals(http_response_code(), 400);
    }
}
