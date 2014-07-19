<?php

class RegisteredUsersTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        new UsersMock();
        include_once('controllers/admin/registeredUsers.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new RegisteredUsers();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object'] = "UsersMock";
        $event = new RegisteredUsers();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true)[0];
        $this->assertEquals($output['userId'], '123456789');
        $this->assertEquals($output['firstName'], 'Brian');
        $this->assertEquals($output['lastName'], 'Pilati');
        $this->assertEquals($output['email'], 'brianpilati@gmail.com');
        $this->assertEquals($output['address'], 'Some Address');
        $this->assertEquals($output['city'], 'In A City');
        $this->assertEquals($output['state'], 'Or State');
        $this->assertEquals($output['zipcode'], '88990');
        $this->assertEquals($output['phoneNumber'], '444 555-6666');
        $this->assertEquals($output['joined'], '2014-05-16 15:00:49');

        $output = json_decode(ob_get_contents(), true)[1];
        $this->assertEquals($output['userId'], '2');
        $this->assertEquals($output['firstName'], 'Cody');
        $this->assertEquals($output['lastName'], 'Ottley');
        $this->assertEquals($output['email'], 'blackdragon5555@yahoo.com');
        $this->assertEquals($output['address'], 'New Address');
        $this->assertEquals($output['city'], 'In A Town');
        $this->assertEquals($output['state'], 'And State');
        $this->assertEquals($output['zipcode'], '09988');
        $this->assertEquals($output['phoneNumber'], '777 888-9999');
        $this->assertEquals($output['joined'], '2013-05-16 15:00:49');
    }
}
