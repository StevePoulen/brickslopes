<?php

class MocTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        new MocsMock();
        include_once('controllers/registered/mocs.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedPOST() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $GLOBALS['db_query'] = '1';
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

    public function testAuthenticatedGET() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[0];
        $this->assertEquals($output['eventId'], '2');
        $this->assertEquals($output['userId'], '1');
        $this->assertEquals($output['themeId'], '3');
        $this->assertEquals($output['title'], 'My Famous MOC');
        $this->assertEquals($output['displayName'], 'Ember Pilati');
        $this->assertEquals($output['mocImageUrl'], 'https://mygirl.org');
        $this->assertEquals($output['baseplateWidth'], '4');
        $this->assertEquals($output['baseplateDepth'], '7');
        $this->assertEquals($output['description'], 'This was so original');
        $this->assertEquals($output['theme'], 'Princess');
    }

    public function testAuthenticatedGETFailure() 
    {
        $_GET = array('eventId' => 2);
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 'Bad Query';
        $event = new Mocs($this->userId);
        $this->assertEquals(http_response_code(), 400);
    }
}
