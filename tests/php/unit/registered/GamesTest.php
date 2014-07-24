<?php

class gamesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 2;
        new GamesMock();
        include_once('controllers/registered/games.php');
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
        $GLOBALS['fetch_object'] = "GamesMock";
        new Games();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $themeObj = $output[0];
        $this->assertEquals($themeObj['eventId'] , 2);
        $this->assertEquals($themeObj['gameId'] , 1);
        $this->assertEquals($themeObj['game'], 'Blind Man Build');
        $this->assertEquals($themeObj['description'], 'You use blindfolds to build');
        $this->assertEquals($themeObj['image'], 'https://blindman.org');
        $this->assertEquals($themeObj['maxParticipants'], '10');
        $this->assertEquals($themeObj['currentParticipants'], '5');
        $this->assertEquals($themeObj['openRegistration'], 'YES');
        $this->assertEquals($themeObj['display'], 'NO');
        $this->assertEquals($themeObj['awards'][0]['award'], "First Place");
        $this->assertEquals($themeObj['awards'][0]['place'], "1");
        $this->assertEquals($themeObj['awards'][1]['award'], "Second Place");
        $this->assertEquals($themeObj['awards'][1]['place'], "2");
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
