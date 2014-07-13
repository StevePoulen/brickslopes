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
        $this->assertEquals($output['joined'], '2014-05-16 15:00:49');
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
