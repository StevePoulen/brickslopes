<?php 

use \Firebase\JWT\JWT;

class jwtToken {

    function __construct() {

    }

    public function createPayload($userId, $firstName, $lastName, $admin, $registered, $paid) {
        return json_encode (
            array (
                'firstName' => $firstName, 
                'lastName' => $lastName,
                'admin' => $admin,
                'registered' => $registered,
                'paid' => $paid,
                'userId' => $userId,
                'token' => $this->encodeJWT($userId, $admin, $registered, $paid)
            )
        );
    }

    private function encodeJWT($userId, $admin, $registered, $paid) {
        $token = array(
            "iss" => "https://www.brickslopes.com",
            "aud" => $_SERVER['HTTP_HOST'],
            "iat" => 1356999524,
            "nbf" => 1357000000,
            "userId" => $userId,
            "admin" => $admin,
            "registered" => $registered,
            "paid" => $paid
         );

        $jwt = JWT::encode($token, JWT_KEY);
        return $jwt;
    }
}

?>
