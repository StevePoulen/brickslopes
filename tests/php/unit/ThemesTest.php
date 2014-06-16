<?php

class ThemesTest extends PHPUnit_Framework_TestCase 
{
    public function setUp() 
    {
        $_GET['eventId'] = 2;
        $this->themesMock = new ThemesMock();
        include_once('controllers/themes.php');
    }

    public function testAuthenticatedBadMethod() 
    {
        $_SERVER['REQUEST_METHOD'] = "post";
        $authentication = new Authentication();
        $this->assertEquals(http_response_code(), 405);
    }

    public function testAuthenticatedGET() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_query'] = '1';
        $GLOBALS['fetch_object_counter_limit'] = '2';
        $this->themesMock->buildGlobalVariables();
        $GLOBALS['fetch_object'] = new ThemesMock();
        new Themes();
        $this->assertEquals(http_response_code(), 200);
        $output = json_decode(ob_get_contents(), true);
        $themeObj = $output[0];
        $this->assertEquals($themeObj['eventId'] , 2);
        $this->assertEquals($themeObj['theme'], 'Steve Rules');
        $this->assertEquals($themeObj['type'], 'AFOL');
        $this->assertEquals($themeObj['awards'][0]['award'], "Helm's Deep");
        $this->assertEquals($themeObj['awards'][0]['place'], "2");
        $this->assertEquals($themeObj['awards'][1]['award'], "Helm's Deep");
        $this->assertEquals($themeObj['awards'][1]['place'], "2");
    }

    public function testAuthenticatedGetFailure() 
    {
        $_SERVER['REQUEST_METHOD'] = "GET";
        $GLOBALS['db_result'] = false;
        $GLOBALS['db_query'] = 0;
        new Themes();
        $this->assertEquals(http_response_code(), 400);
    }
}
