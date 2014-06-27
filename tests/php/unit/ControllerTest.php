<?php

function buildJWT() {
    return JWT::encode(
        ARRAY (
            "iss" => "https://www.brickslopes.com",
            "aud" => "https://www.myjwt.com",
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "userId" => 05169175
        )
    , JWT_KEY);
}

function apache_request_headers() {
    if ($GLOBALS['authenticationRequest']) {
        return Array(
            'Authtoken' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MzM0fQ.9Z2PXQwm_ugnSIzNLyV-HQXbNczehYYY6jkaR_ij1dM'
        );
    } else if (array_key_exists('badAuthenticationRequest', $GLOBALS) && $GLOBALS['badAuthenticationRequest']) {
        return Array(
            'Authtoken' => '.eyJpc3MiOiJodHRwczpcL1wvd3d3LmJyaWNrc2xvcGVzLmNvbSIsImF1ZCI6Imh0dHBzOlwvXC93d3cubXlqd3QuY29tIiwiaWF0IjoxMzU2OTk5NTI0LCJuYmYiOjEzNTcwMDAwMDAsInVzZXJJZCI6MzM0fQ.9Z2PXQwm_ugnSIzNLyV-HQXbNczehYYY6jkaR_ij1dM'
        );
    } else {
        return Array();
    }
}

class ControllerTest extends PHPUnit_Framework_TestCase 
{

    public function setUp() 
    {
        $GLOBALS['authenticationRequest'] = false;
    }

    public function testAuthenticatedSuccess() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/{{eventYear}}/');
    }

    public function testAuthenticatedSuccessController() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/controllers/authentication.php";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputString('');
    }

    public function testAuthenticatedSuccessNotFound() 
    {
        $GLOBALS['authenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/notfound.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 404);
        $this->expectOutputString('');
    }

    public function testAuthenticatedRequestNoAuthenticationHeader() 
    {
        $GLOBALS['authenticationRequest'] = false;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAuthenticatedRequestBadJWT() 
    {
        $GLOBALS['badAuthenticationRequest'] = true;
        $_SERVER['REQUEST_URI'] = "/partials/afol/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 403);
        $this->expectOutputString('');
    }

    public function testAnonymousHomePageSuccess() 
    {
        $_SERVER['REQUEST_URI'] = "/";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/A LEGO Fan Event/');
    }

    public function testAnonymousSuccess() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/public/index.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 200);
        $this->expectOutputRegex('/A LEGO Fan Event/');
    }

    public function testAnonymousNotFound() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/public/notfound.html";
        $this->controller = new Controller();
        $this->controller->invoke();
        $this->assertEquals(http_response_code(), 404);
        $this->expectOutputString('');
    }

/*
Deprecated - moved to authentication
    public function testEncodeJWT() 
    {
        $_SERVER['REQUEST_URI'] = "/partials/public/notfound.html";
        $_SERVER['HTTP_HOST'] = "https://www.myjwt.com";
        $this->controller = new Controller();
        $this->assertEquals($this->controller->encodeJWT(05169175), buildJWT());
    }
    */
}
