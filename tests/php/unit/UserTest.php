<?php

class UserTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 123456789;
        $this->isAdmin = true;
        $this->isRegistered = true;
        $this->isPaid = true;
        new UsersMock();
        include_once('controllers/user.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new User($this->userId, $this->isAdmin, $this->isRegistered, $this->isPaid);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new User($this->userId, true, true, true);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['userId'], '123456789');
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
        $authentication = new User($this->userId, false, false, false);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['firstName'] , 'Steve');
        $this->assertEquals($output['lastName'] , 'Poulsen');
        $this->assertEquals($output['admin'] , 'NO');
        $this->assertEquals($output['registered'] , 'NO');
        $this->assertEquals($output['paid'] , 'NO');
        $this->assertEquals($output['userId'] , '123456789');
        $this->validateJwt($output['token'], 'NO', 'NO');

        $emailOutput = $GLOBALS['addEmailHistoryInformation'][0];
        $this->assertEquals($emailOutput['subject'], 'BrickSlopes User Registration');
        $this->assertContains('registered member of BrickSlopes', $emailOutput['body']);
        $this->assertEquals(sizeOf($emailOutput), 7);
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
        $authentication = new User($this->userId, true, true, true);
        $this->assertEquals(http_response_code(), 201);
        $output = json_decode(get_ob(), true);
        $this->assertEquals($output['firstName'] , 'Steve');
        $this->assertEquals($output['lastName'] , 'Poulsen');
        $this->assertEquals($output['admin'] , 'YES');
        $this->assertEquals($output['registered'] , 'YES');
        $this->assertEquals($output['paid'] , 'YES');
        $this->assertEquals($output['userId'] , '123456789');
        $this->validateJwt($output['token']);
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        $event = new User($this->userId, true, true, true);
        $this->assertEquals(http_response_code(), 400);
    }

    public function validateJwt($token, $admin='YES', $registered='YES') {
        $jwt = JWT::decode($token, JWT_KEY);
        $this->assertEquals($jwt->iss, 'https://www.brickslopes.com');
        $this->assertEquals($jwt->aud, 'www.mybrickslopes.com');
        $this->assertEquals($jwt->iat, '1356999524');
        $this->assertEquals($jwt->nbf, '1357000000');
        $this->assertEquals($jwt->userId, '123456789');
        $this->assertEquals($jwt->admin, $admin);
        $this->assertEquals($jwt->registered, $registered);
    }
}
