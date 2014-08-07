<?php

class gamesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 2;
        include_once('controllers/paid/games.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new Games();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new Games();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true);
        $gameObj = $output[0];
        $this->assertEquals($gameObj['eventId'] , 2);
        $this->assertEquals($gameObj['gameId'] , 1);
        $this->assertEquals($gameObj['game'], 'Blind Man Build');
        $this->assertEquals($gameObj['description'], 'You use blindfolds to build');
        $this->assertEquals($gameObj['image'], 'https://blindman.org');
        $this->assertEquals($gameObj['fee'], 'YES');
        $this->assertEquals($gameObj['maxParticipants'], '10');
        $this->assertEquals($gameObj['currentParticipants'], '5');
        $this->assertEquals($gameObj['openRegistration'], 'YES');
        $this->assertEquals($gameObj['display'], 'NO');
        $this->assertEquals($gameObj['awards'][0]['award'], "First Place");
        $this->assertEquals($gameObj['awards'][0]['place'], "1");
        $this->assertEquals(ISSET($gameObj['awards'][1]['award']), false);
        $this->assertEquals(ISSET($gameObj['awards'][1]['place']), false);
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        new Games();
        $this->assertEquals(http_response_code(), 400);
    }
}
