<?php
    class mail {
        public function __construct($email) {
            $this->message = "";
            $this->subject = "";
            $this->email = $email;
        }

        public function sendEmailUsMessage($data) {
            $this->subject = "BrickSlopes Question";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes Question</title>
                    </head>
                    <body>
                        <div style='font-size: 16px;'>
                            Cody, Steve or Brian,

                            {$data['firstName']} {$data['lastName']} has asked the following question:
                            <p>
                            {$data['comments']}
                            <p>
                            Please respond to this e-mail {$data['email']}
                        </div>
            ";

            $this->message .= $this->getDisclaimer();

            $this->message .= "
                    </body>
                </html>
            ";

            $this->sendEmail();

        }

        public function sendUserRegistrationMessage($firstName) {
            $this->subject = "BrickSlopes Registration Complete";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes User Registration</title>
                    </head>
                    <body>
                        <div style='font-size: 16px;'>
                            $firstName,
                            <p>
                            You are receiving this e-mail because you registered to be a member of BrickSlopes - A LEGO Fan Event.
                            <p>
                            Please visit {$this->getDomain()}/#/afol/login.html for more information.
                        </div>
            ";

            $this->message .= $this->getDisclaimer();

            $this->message .= "
                    </body>
                </html>
            ";

            $this->sendEmail();
        }

        public function sendEventRegistrationMessage($userId) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            if($usersObj->result) {
                $dbObj = $usersObj->result->fetch_object();
                $this->email = $dbObj->email;

                $this->subject = "BrickSlopes Registration";
                $this->message = "
                    <html>
                        <head>
                            <title>BrickSlopes Registration</title>
                        </head>
                        <body>
                            <div style='font-size: 16px;'>
                                {$dbObj->firstName},
                                <p>
                                You are receiving this e-mail because you registered for BrickSlopes 2015 - Salt Lake City.
                                <p>
                                You will receive a confirmation e-mail once your registration is complete.
                                <p>
                                Please visit {$this->getDomain()}/#/afol/login.html for more information.
                            </div>
                ";

                $this->message .= $this->getDisclaimer();

                $this->message .= "
                        </body>
                    </html>
                ";

                $this->sendEmail();
            }
        }

        public function sendRegistrationPaidMessage($firstName) {
            $this->subject = "BrickSlopes Registration Complete";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes Registration Complete</title>
                    </head>
                    <body>
                        <div style='font-size: 16px;'>
                            $firstName,
                            <p>
                            You are receiving this e-mail because your BrickSlopes 2015 - Salt Lake City registration is complete.
                            <p>
                            Please visit {$this->getDomain()}/#/afol/login.html for more information.
                        </div>
            ";

            $this->message .= $this->getDisclaimer();

            $this->message .= "
                    </body>
                </html>
            ";

            $this->sendEmail();
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
            $headers .= "From: 'BrickSlopes' <cody@brickslopes.com>\r\n";
            $headers .= "Reply-To: 'BrickSlopes' <cody@brickslopes.com>\r\n";
            $headers .= "X-Mailer: PHP/".phpversion();
            // send email
            mail($to, $this->subject, $this->message, $headers);
        }

        private function getDomain() {
            return "https://www." . WEBSITE;
        }
    }

?>
