<?php

class FeedbackTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $this->userId = 123456789;
        include_once('controllers/public/feedback.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        new Feedback($this->userId);
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $event = new Feedback($this->userId);
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(get_ob(), true)[0];
        $this->assertEquals($output['feedbackId'], '1');
        $this->assertEquals($output['userId'], '23');
        $this->assertEquals($output['email'], 'brianpilati@gmail.com');
        $this->assertEquals($output['feedback'], 'This is insane');
        $this->assertEquals($output['posted'], '2014-05-16 15:00:49');
    }

    public function testAuthenticatedPost() 
    {
        $_SERVER['REQUEST_METHOD'] = "POST";
        $_POST = array(
            'userId' => NULL,
            'emailId' => NULL,
            'feedback' => 'This is bogus - BRO!!!!'
        );
        $GLOBALS['db_query'] = 123456789;
        $GLOBALS['users_userId'] = '123456789';
        $authentication = new Feedback($this->userId);
        $this->assertEquals(http_response_code(), 201);
        $this->expectOutputString('');
    }
}
