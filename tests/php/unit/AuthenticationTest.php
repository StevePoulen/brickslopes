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
        $_SERVER['REQUEST_METHOD'] = "GET";
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST['email'] = 'brianpilati@gmail.com';
        $_POST['password'] = 'vErYsEcUrE';
        $GLOBALS['db_query'] = 1;
        $GLOBALS['fetch_object'] = new UsersMock();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $this->assertEquals($output['data']['firstName'] , 'Brian');
        $this->assertEquals($output['data']['lastName'] , 'Pilati');
        $this->assertEquals($output['data']['admin'] , 'YES');
        $this->assertEquals($output['data']['token'] , "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOiIxIiwiYWRtaW4iOiJZRVMifQ.Uz4-hSQIyz0YvJ7BkvbmJsxGoVLedGZCLxxfySAbWIk");
        $this->assertEquals($output['status'], 200);
    }


    public function testAuthenticatedPutSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "PUT";
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['fetch_object'] = new UsersMock();
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
        $GLOBALS['fetch_object'] = new UsersMock();
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
