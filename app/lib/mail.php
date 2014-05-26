<?php
    class Mail {
        public function __construct($email) {
            $this->message = "";
            $this->subject = "";
            $this->email = $email;
        }

        public function sendResetEmailMessage($firstName, $newPassword) {
            $this->subject = "BrickSlopes Reset Password Request";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes Reset Password Request</title>
                    </head>
                    <body>
                        <div style='font-size: 16px;'>
                            $firstName,
                            <p>
                            You are receiving this e-mail because you have requested to reset your password.
                            <p>
                            Your new temporary password is: <b>$newPassword</b>
                            <p>
                            Please visit {$this->getDomain()}/#/afol/login.html to reset your password.
                        </div>
            ";

            $this->message .= $this->getDisclaimer();

            $this->message .= "
                    </body>
                </html>
            ";

            $this->sendEmail();

        }

        private function getDisclaimer() {
            return "
                <div style='font-size: 12px;'>
                    The information contained in this communication is confidential. This communication is intended only for the use of the addressee ({$this->email}).<br>If you are not the intended recipient, please notify legal@brickslopes.com promptly and delete the message.<br>Any distribution or copying of this message without the consent of BrickSlopes is prohibited.
                </div>
            ";
        }

        private function sendEmail() {
            $to = $this->email;
            // compose headers
            // To send HTML mail, the Content-type header must be set
            $headers = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
            $headers .= "From: no-reply@brickslopes.com\r\n";
            $headers .= "Reply-To: no-reply@brickslopes.com\r\n";
            $headers .= "X-Mailer: PHP/".phpversion();
            // send email
            mail($to, $this->subject, $this->message, $headers);
        }

        private function getDomain() {
            return "https://www." . WEBSITE;
        }
    }

?>
