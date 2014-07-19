<?php

class UserTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 5;
        new UsersMock();
        include_once('controllers/user.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new User($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "UsersMock";
        $event = new User($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['userId'], '1');
        $this->assertEquals($output['firstName'], 'Brian');
        $this->assertEquals($output['lastName'], 'Pilati');
        $this->assertEquals($output['email'], 'brianpilati@gmail.com');
        $this->assertEquals($output['address'], 'Some Address');
        $this->assertEquals($output['city'], 'In A City');
        $this->assertEquals($output['state'], 'Or State');
        $this->assertEquals($output['zipcode'], '88990');
        $this->assertEquals($output['phoneNumber'], '444 555-6666');
        $this->assertEquals($output['flickr'], 'bflickr');
        $this->assertEquals($output['joined'], '2014-05-16 15:00:49');
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST = array(
            'firstName' => 'Steve',
            'lastName' => 'Poulsen',
            'email' => 'steve@brickslopes.com'
        );
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['users_userId'] = '123456789';
        $GLOBALS['fetch_object'] = new UsersMock();
        $authentication = new User($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['data']['firstName'] , 'Steve');
        $this->assertEquals($output['data']['lastName'] , 'Poulsen');
        $this->assertEquals($output['data']['admin'] , 'NO');
        $this->assertEquals($output['data']['registered'] , 'NO');
        $this->assertEquals($output['data']['token'] , "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOjEyMzQ1Njc4OSwiYWRtaW4iOiJOTyIsInJlZ2lzdGVyZWQiOiJOTyJ9.RU3tdPj41zsU3DTltyX4PDEiPwxIuDUCN-ttvSPbXco");
        $this->assertEquals($output['status'], 201);

        $this->assertEquals($GLOBALS['sendUserRegistrationMessage'], 'Steve');
    }

    public function testAuthenticatedPatch() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $_POST = array(
            'firstName' => 'Steve',
            'lastName' => 'Poulsen',
            'email' => 'steve@brickslopes.com'
        );
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['users_userId'] = '123456789';
        $GLOBALS['fetch_object'] = new UsersMock();
        $authentication = new User($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['data']['firstName'] , 'Steve');
        $this->assertEquals($output['data']['lastName'] , 'Poulsen');
        $this->assertEquals($output['data']['admin'] , 'NO');
        $this->assertEquals($output['data']['registered'] , 'NO');
        $this->assertEquals($output['data']['token'] , "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOjEyMzQ1Njc4OSwiYWRtaW4iOiJOTyIsInJlZ2lzdGVyZWQiOiJOTyJ9.RU3tdPj41zsU3DTltyX4PDEiPwxIuDUCN-ttvSPbXco");
        $this->assertEquals($output['status'], 201);
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        $event = new User($this->userId);
        $this->assertEquals(http_response_code(), 400);
    }
}
