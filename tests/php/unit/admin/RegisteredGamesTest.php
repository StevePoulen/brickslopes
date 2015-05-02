<?php

class RegisteredGamesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        include_once('controllers/admin/registeredGames.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new RegisteredGames();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_GET = array (
            'eventId' => '123445'
        );
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        new RegisteredGames();
        $this->assertEquals(http_response_code(), 200);
        $buffer = json_decode(get_ob(), true);
        $game = $buffer[0];
        $this->assertEquals($game['gameName'], 'First Game');
        $this->assertEquals($game['maxParticipants'], '22');
        $this->assertEquals($game['registeredAfols'][0]['firstName'], 'Steve');
        $this->assertEquals($game['registeredAfols'][0]['lastName'], 'Poulsen');
        $this->assertEquals($game['registeredAfols'][0]['paid'], 'YES');
        $this->assertEquals(sizeOf($game['registeredAfols'][0]), 3);
        $this->assertEquals(sizeOf($game), 3);

        $this->assertEquals($game['registeredAfols'][1]['firstName'], 'Brian');
        $this->assertEquals($game['registeredAfols'][1]['lastName'], 'Pilati');
        $this->assertEquals($game['registeredAfols'][1]['paid'], 'NO');
        $this->assertEquals(sizeOf($game['registeredAfols'][1]), 3);

        $game = $buffer[1];
        $this->assertEquals($game['gameName'], 'Second Game');
        $this->assertEquals($game['maxParticipants'], '33');
        $this->assertEquals($game['registeredAfols'][0]['firstName'], 'Cody');
        $this->assertEquals($game['registeredAfols'][0]['lastName'], 'Ottley');
        $this->assertEquals($game['registeredAfols'][0]['paid'], 'YES');
        $this->assertEquals(sizeOf($game['registeredAfols'][0]), 3);
    }
}
