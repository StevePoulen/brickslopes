<?php

class AuthenticationTest extends \PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
// Create a stub for the SomeClass class.
$stub = $this->getMock('users');

// Configure the stub.
$stub->expects($this->any())
->method('authenticateUser')
->will($this->returnValue('foo'));

$stub->expects($this->any())
->method('__construct')
->will($this->returnValue('foo'));

// Calling $stub->doSomething() will now return
// 'foo'.
//$this->assertEquals('foo', $stub->authenticateUser(array()));
    }

    public function testAuthenticatedSuccess() 
    {
        $_SERVER['REQUEST_METHOD'] = "purchase";
        include('controllers/authentication.php');
        $this->assertEquals(http_response_code(), 405);
    }
}
