<?php

use \Firebase\JWT\JWT;

class AuthenticationTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = null;
        include_once('controllers/public/authentication.php');
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
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['firstName'] , 'Brian');
        $this->assertEquals($output['lastName'] , 'Pilati');
        $this->assertEquals($output['admin'] , 'YES');
        $this->assertEquals($output['registered'] , 'YES');
        $this->validateJwt($output['token']);
    }


    public function testAuthenticatedPutSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "PUT";
        $GLOBALS['db_query'] = 123456789;
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes Reset Password Request');
    }

    public function testAuthenticatedPutFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "PUT";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 123456789;
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 200);
        $this->assertEquals(ISSET($GLOBALS['phpmailer_subject']), false);
    }

    public function testAuthenticatedPatchSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "PATCH";
        $GLOBALS['db_query'] = 1;
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

    public function validateJwt($token, $admin='YES', $registered='YES') {
        $jwt = JWT::decode($token, JWT_KEY, array('HS256'));
        $this->assertEquals($jwt->iss, 'https://www.brickslopes.com');
        $this->assertEquals($jwt->aud, 'www.mybrickslopes.com');
        $this->assertEquals($jwt->iat, '1356999524');
        $this->assertEquals($jwt->nbf, '1357000000');
        $this->assertEquals($jwt->userId, '123456789');
        $this->assertEquals($jwt->admin, $admin);
        $this->assertEquals($jwt->registered, $registered);
    }
}
