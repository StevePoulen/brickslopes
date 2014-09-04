<?php

class GameUserTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 4;
        include_once('controllers/paid/gameUser.php');
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
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)['1'];
        $this->assertEquals($output['gameId'] , 1);
        $this->assertEquals($output['eventId'] , 2);
        $this->assertEquals($output['userId'] , 3);
        $this->assertEquals($output['gameTeamId'] , 4);
        $this->assertEquals($output['type'] , 'PARTICIPANT');
        $this->assertEquals($output['gameTitle'] , 'Blind Man Build');
    }

    public function testAuthenticatedPOSTWithNoGameFee() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST = array (
            'gameId' => 2,
            'eventId' => 3,
            'type' => 'PARTICIPANT'

        );
        $GLOBALS['db_query'] = '1';
        new GameUser($this->userId);
        $GLOBALS['addRegistrationLineItems'] = array();
        $this->assertEquals(sizeOf($GLOBALS['addRegistrationLineItems']), 0);
        $this->assertEquals(http_response_code(), 201);

        //Games
        $this->assertEquals(sizeOf($GLOBALS['addGameUserInformation']), 1);

        //Games 1
        $gameOutput = $GLOBALS['addGameUserInformation'][0];
        $this->assertEquals($gameOutput['gameId'], '2');
        $this->assertEquals($gameOutput['userId'], '4');
        $this->assertEquals($gameOutput['eventId'], '3');
        $this->assertEquals($gameOutput['gameTeamId'], null);
        $this->assertEquals($gameOutput['type'], 'PARTICIPANT');
    }

    public function testAuthenticatedPOSTWithGame3Fee() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST = array (
            'gameId' => 3,
            'eventId' => 3,
            'type' => 'Ember'
        );
        $GLOBALS['db_query'] = '1';
        new GameUser($this->userId);
        $gameInformation = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($gameInformation['eventId'], 3);
        $this->assertEquals($gameInformation['userId'], 4);
        $this->assertEquals($gameInformation['lineItem'], 'Draft - $15');
        $this->assertEquals($gameInformation['amount'], '15.00');
        $this->assertEquals($gameInformation['paid'], 'NO');
        $this->assertEquals($gameInformation['discount'], 'YES');
        $this->assertEquals($gameInformation['description'], NULL);
        $this->assertEquals($gameInformation['size'], NULL);
        $this->assertEquals($gameInformation['quantity'], 1);
        $this->assertEquals($gameInformation['active'], 'YES');
        $this->assertEquals($gameInformation['eventLineItemCodeId'], 8);
        $this->assertEquals(http_response_code(), 201);

        //Games
        $this->assertEquals(sizeOf($GLOBALS['addGameUserInformation']), 1);

        //Games 1
        $gameOutput = $GLOBALS['addGameUserInformation'][0];
        $this->assertEquals($gameOutput['gameId'], '3');
        $this->assertEquals($gameOutput['userId'], '4');
        $this->assertEquals($gameOutput['eventId'], '3');
        $this->assertEquals($gameOutput['gameTeamId'], null);
        $this->assertEquals($gameOutput['type'], 'Ember');
    }

    public function testAuthenticatedPOSTWithGame4Fee() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST = array (
            'gameId' => 4,
            'eventId' => 3,
            'gameTeamId' => 13,
            'type' => 'PARTICIPANT'

        );
        $GLOBALS['db_query'] = '1';
        new GameUser($this->userId);
        $gameInformation = $GLOBALS['addRegistrationLineItems'][0];
        $this->assertEquals($gameInformation['eventId'], 3);
        $this->assertEquals($gameInformation['userId'], 4);
        $this->assertEquals($gameInformation['lineItem'], 'Draft - $25');
        $this->assertEquals($gameInformation['amount'], '25.00');
        $this->assertEquals($gameInformation['paid'], 'NO');
        $this->assertEquals($gameInformation['discount'], 'YES');
        $this->assertEquals($gameInformation['description'], NULL);
        $this->assertEquals($gameInformation['size'], NULL);
        $this->assertEquals($gameInformation['quantity'], 1);
        $this->assertEquals($gameInformation['active'], 'YES');
        $this->assertEquals($gameInformation['eventLineItemCodeId'], 9);
        $this->assertEquals(http_response_code(), 201);

        //Games
        $this->assertEquals(sizeOf($GLOBALS['addGameUserInformation']), 1);

        //Games 1
        $gameOutput = $GLOBALS['addGameUserInformation'][0];
        $this->assertEquals($gameOutput['gameId'], '4');
        $this->assertEquals($gameOutput['userId'], '4');
        $this->assertEquals($gameOutput['eventId'], '3');
        $this->assertEquals($gameOutput['gameTeamId'], 13);
        $this->assertEquals($gameOutput['type'], 'PARTICIPANT');
    }

    public function testAuthenticatedDELETE() 
    {
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        $_POST['userId'] = 5;
        $GLOBALS['db_query'] = '1';
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 200);
    }

    public function testAuthenticatedDELETEError() 
    {
        $_SERVER['REQUEST_METHOD'] = "DELETE";
        $_POST['userId'] = 5;
        $GLOBALS['db_query'] = 'failure';
        new GameUser($this->userId);
        $this->assertEquals(http_response_code(), 400);
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
