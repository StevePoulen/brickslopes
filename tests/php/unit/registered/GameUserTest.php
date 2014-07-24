<?php

class GameUserTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 2;
        new GameUserMock();
        include_once('controllers/registered/gameUser.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "GameUserMock";
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[0];
        $this->assertEquals($output['gameId'] , 1);
        $this->assertEquals($output['eventId'] , 2);
        $this->assertEquals($output['userId'] , 3);
        $this->assertEquals($output['gameTeamId'] , 4);
        $this->assertEquals($output['type'] , 'PARTICIPANT');
    }

    public function testAuthenticatedPOST() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST['userId'] = 5;
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "GameUserMock";
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 201);
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 400);
    }
}
