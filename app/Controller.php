<?php
    include_once join('/', array(__DIR__, 'php', 'AutoLoader.php'));
    require_once("../config/config.php");

    header( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
    header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
    header( 'Cache-Control: no-cache, must-revalidate' );
    header( 'Pragma: no-cache' ); 



    class Controller {

        public function __construct() {
            $this->userId = null;
            $this->setControllerModuleValues();
            $this->setHeader();
        }

        private function setControllerModuleValues() {
            $this->URI = substr($_SERVER['REQUEST_URI'], 1);
            $payloadPosition = strpos($this->URI, '?');
            if ($payloadPosition) {
                $this->URI = substr($this->URI, 0, $payloadPosition);
            }
            if ($this->URI == "") {
                $this->URI = 'index.html';
            }
        }

        private function setHeader() {
            if (preg_match('/\.css$/', $this->URI)) {
                header('Content-type: text/css');
            } else if (preg_match('/\.png$/', $this->URI)) {
                header('Content-type: image/png');
            } else if (preg_match('/\.js$/', $this->URI)) {
                header('Content-type: application/javascript');
            } else {
                header('Content-type: text/html');
            }   
        }

        private function isWhiteList() {
            if ($this->URI == 'index.html' ||
                $this->URI == 'favicon.ico' || 
                preg_match('/^(css|lib|js|partials\/public|images)/', $this->URI) ||
                $this->URI == 'controllers/authentication.php'
            ) {
                return true;
            } else {
                return false;
            }
        }

        private function isAuthenticated() {
            if ($this->isWhiteList()) {
                return true;
            } else {
                $headers = apache_request_headers();
                if ($this->decodeJWT($headers['Authorization'])) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        private function decodeJWT($jwt) {
            $decoded = JWT::decode($jwt, JWT_KEY);
            try {
                if (preg_match('/\d+/', $decoded->userId)) {
                    $this->userId = $decoded->userId;
                    return true;
                } else {
                    return false;
                }
            } catch (Exception $e) {
                return false;
            }
        }

        public function encodeJWT($userId) {
            $token = array(
                "iss" => "https://www.brickslopes.com",
                "aud" => $_SERVER['HTTP_HOST'],
                "iat" => 1356999524,
                "nbf" => 1357000000,
                "userId" => $userId
             );

            $jwt = JWT::encode($token, JWT_KEY);
            return $jwt;
        }

        public function invoke() {
            if ($this->isAuthenticated()) {
                if (file_exists($this->URI)) {
                    include_once($this->URI);
                } else {
                    header("HTTP/1.0 404 Not Found");
                }
            } else {
                header("HTTP/1.0 403 Forbidden");
                include_once('index.html');
            }
        }
    }

    $controller = new Controller();
    $controller->invoke();
?>
