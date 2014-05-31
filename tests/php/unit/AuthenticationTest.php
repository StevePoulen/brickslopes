<?php

include_once('controllers/authentication.php');

class AuthenticationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
    }

    public function testAuthenticatedGet() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $_GET['email'] = 'brianpilati@gmail.com';
        $_GET['password'] = 'vErYsEcUrE';
        $GLOBALS['db_query'] = 1;
        $GLOBALS['users_userId'] = '123456789';
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputString('{"data":{"firstName":"d^3 => default dummy data","lastName":"d^3 => default dummy data","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOiIxMjM0NTY3ODkifQ.fIW7IU7CiW5dLF77GuzvavKOysS2GKqcfbkCkDChlGA"},"status":200}');
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_GET['email'] = 'brianpilati@gmail.com';
        $_GET['password'] = 'vErYsEcUrE';
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['users_userId'] = '123456789';
        $GLOBALS['fetch_object'] = new usersObject();
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 201);
        $this->expectOutputString('{"data":{"firstName":null,"lastName":null,"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Ind3dy5teWJyaWNrc2xvcGVzLmNvbSIsImlhdCI6MTM1Njk5OTUyNCwibmJmIjoxMzU3MDAwMDAwLCJ1c2VySWQiOjEyMzQ1Njc4OX0.uj2RrezXOJihEit3Z3YBVdX0YSApc77kFx2EmTyNrWE"},"status":201}');
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

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "purchase";
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 405);
    }
}
