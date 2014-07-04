<?php

class AuthenticationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/authentication.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "purchase";
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $_GET['email'] = 'brianpilati@gmail.com';
        $_GET['password'] = 'vErYsEcUrE';
        $GLOBALS['db_query'] = 1;
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['data']['firstName'] , 'Brian');
        $this->assertEquals($output['data']['lastName'] , 'Pilati');
        $this->assertEquals($output['data']['admin'] , 'YES');
        $this->assertEquals($output['data']['token'] , "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOiIxIiwiYWRtaW4iOiJZRVMifQ.Uz4-hSQIyz0YvJ7BkvbmJsxGoVLedGZCLxxfySAbWIk");
        $this->assertEquals($output['status'], 200);
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST['firstName'] = 'Steve';
        $_POST['lastName'] = 'Poulsen';
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['users_userId'] = '123456789';
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['data']['firstName'] , 'Steve');
        $this->assertEquals($output['data']['lastName'] , 'Poulsen');
        $this->assertEquals($output['data']['admin'] , 'NO');
        $this->assertEquals($output['data']['token'] , "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOjEyMzQ1Njc4OSwiYWRtaW4iOiJOTyJ9.R7nid7T9h1HLyydRwZFRcYbJiqfFwgsWpTPi--F5HKE");
        $this->assertEquals($output['status'], 201);
    }

    public function testAuthenticatedPutSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "PUT";
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals(strlen($GLOBALS['sendResetEmailMessage_password']), 8);
    }

    public function testAuthenticatedPutFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "PUT";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 123456789;
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals(ISSET($GLOBALS['sendResetEmailMessage_password']), false);
    }

    public function testAuthenticatedPatchSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_query'] = 1;
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication(12345678);
        $this->assertEquals(http_response_code(), 200);
    }

    public function testAuthenticatedPatchFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = null;
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 412);
    }
}
