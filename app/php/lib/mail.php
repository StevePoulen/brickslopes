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
                        {$this->getFontWrapper(16, '#000000')}
                            Cody, Steve or Brian,

                            {$data['firstName']} {$data['lastName']} has asked the following question:
                            <p>
                            {$data['comments']}
                            <p>
                            Please respond to this e-mail {$data['email']}
                        {$this->getFontClosure()}
            ";

            $this->message .= $this->getDisclaimer();

            $this->message .= "
                    </body>
                </html>
            ";

            $this->sendEmail();

        }

        public function sendUserRegistrationMessage($firstName, $display=false) {
            $this->subject = "BrickSlopes Registration Complete";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes User Registration</title>
                    </head>
                    <body>
                        {$this->getEmailBackgroundHeader()}
                        {$this->getFirstLineSpoiler()}
                        {$this->getBSLogo()}
                        {$this->getNavigation()}
                        {$this->getTableHeader()}
                        <tr>
                            <td align=left>
                                {$this->getFontWrapper(16, '#000000')}
                                    $firstName,
                                    <p>
                                    Congratulations this e-mail confirms you have registered to be a member of BrickSlopes - A LEGO Fan Event&trade;.
                                    <p>
                                    {$this->getPleaseVisit()}
                                {$this->getFontClosure()}
                            </td>
                        </tr>
                        {$this->getTableFooter()}
                        {$this->getDisclaimer()}
                        {$this->getCopyRight()}
                        {$this->getDivClosure()}
                    </body>
                </html>
            ";

            if ($display) {
                return $this->message;
            } else {
                $this->sendEmail();
            }
        }

        public function sendEventRegistrationMessage($userId, $display=false) {
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
                            {$this->getEmailBackgroundHeader()}
                            {$this->getFirstLineSpoiler()}
                            {$this->getBSLogo()}
                            {$this->getNavigation()}
                            {$this->getTableHeader()}
                            <tr>
                                <td align=left>
                                    {$this->getFontWrapper(16, '#000000')}
                                        {$dbObj->firstName},
                                        <p>
                                        Congratulations! You this e-mail confirms you are registered for BrickSlopes 2015 - Salt Lake City.
                                        <p>
                                        You will receive a confirmation e-mail once your registration is complete.
                                        <p>
                                        {$this->getPleaseVisit()}
                                    {$this->getFontClosure()}
                                </td>
                            </tr>
                            {$this->getTableFooter()}
                            {$this->getDisclaimer()}
                            {$this->getCopyRight()}
                            {$this->getDivClosure()}
                        </body>
                    </html>
                ";

                if ($display) {
                    return $this->message;
                } else {
                    $this->sendEmail();
                }
            }
        }

        public function sendRegistrationPaidMessage($firstName, $display=false) {
            $this->subject = "BrickSlopes Registration Complete";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes Registration Complete</title>
                    </head>
                    <body>
                        {$this->getEmailBackgroundHeader()}
                        {$this->getFirstLineSpoiler()}
                        {$this->getBSLogo()}
                        {$this->getNavigation()}
                        {$this->getTableHeader()}
                            <tr>
                                <td align=left>
                                    {$this->getFontWrapper(16, '#000000')}
                                        $firstName,
                                        <p>
                                        You are receiving this e-mail because your BrickSlopes 2015 - Salt Lake City registration is complete.
                                        <p>
                                        {$this->getPleaseVisit()}
                                    {$this->getFontClosure()}
                                </td>
                            </tr>
                        {$this->getTableFooter()}
                        {$this->getDisclaimer()}
                        {$this->getCopyRight()}
                        {$this->getDivClosure()}
                    </body>
                </html>
            ";

            if ($display) {
                return $this->message;
            } else {
                $this->sendEmail();
            }
        }

        public function sendResetEmailMessage($firstName, $newPassword, $display=false) {
            $this->subject = "BrickSlopes Reset Password Request";
            $this->message = "
                <html>
                    <head>
                        <title>BrickSlopes Reset Password Request</title>
                    </head>
                    <body>
                        {$this->getEmailBackgroundHeader()}
                        {$this->getFirstLineSpoiler()}
                        {$this->getBSLogo()}
                        {$this->getNavigation()}
                        {$this->getTableHeader()}
                            <tr>
                                <td align=left>
                                    {$this->getFontWrapper(16, '#000000')}
                                        $firstName,
                                        <p>
                                        You are receiving this e-mail because you have requested to reset your password.
                                        <p>
                                        Your new temporary password is: <b>$newPassword</b>
                                        <p>
                                        <a href='{$this->getDomain()}/#/afol/login.html' target='_blank'>{$this->getDomain()}</a> to reset your password.
                                    {$this->getFontClosure()}
                                </td>
                            </tr>
                        {$this->getTableFooter()}
                        {$this->getDisclaimer()}
                        {$this->getCopyRight()}
                        {$this->getDivClosure()}
                    </body>
                </html>
            ";

            if ($display) {
                return $this->message;
            } else {
                $this->sendEmail();
            }
        }

        private function getFontFamily() {
            return "FONT-FAMILY:Arial,Helvetica,Verdana,sans-serif;";

        }

        private function getEmailBackgroundHeader() {
            return "
                <div style='width:auto; height:800px; border-radius:10px; background:#FFFFFF; border:5px solid black; {$this->getFontFamily()} bgcolor:#FFFFFF;'>
            ";
        }

        private function getDivClosure() {
            return "
                </div>
            ";
        }

        private function getPleaseVisit() {
            return "
                Need more LEGO goodness? Then get over to <a href='{$this->getDomain()}' target='_blank'>{$this->getDomain()}</a> for more information about
                <ul>
                    <li>BrickSlopes 2015</li>
                    <li>Games</li>
                    <li>Themes</li>
                    <li>Attending AFOLs and TFOLs</li>
                    <li>Register your MOCs</li>
                    <li>View the Schedule</li>
                </ul>
            ";
        }

        private function getFontWrapper($fontSize=12, $fontColor='#999999') {
            $lineHeight = $fontSize + 1;
            return "
                <font style='FONT-SIZE:{$fontSize}px;COLOR:{$fontColor};LINE-HEIGHT:{$lineHeight}px;{$this->getFontFamily()}'>
            ";
        }

        private function getFontClosure() {
            return "
                </font>
            ";
        }


        private function getTableHeader($bgColor="#FFFFFF") {
            return "
                <table width=100%>
                    <tbody>
                        <tr>
                            <td align=center>
                                <table width='800' cellspacing='0' cellpadding='0' border='0' align='center' style='padding-bottom:10px;' bgcolor='$bgColor'>
                                    <tbody>
            ";
        }

        private function getTableFooter() {
            return "
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ";
        }

        private function getNavigation() {
            $width='25%';
            return "
                {$this->getTableHeader()}
                <tr>
                    <td align=center width=$width>
                        <a target='_blank' href='{$this->getDomain()}'><img src='{$this->getDomain()}/images/emails/navigation/email_header_01.gif'></a>
                    </td>
                    <td align=center width=$width>
                        <a target='_blank' href='{$this->getDomain()}/#/afol/eventMe.html'><img src='{$this->getDomain()}/images/emails/navigation/email_header_02.gif'></a>
                    </td>
                    <td align=center width=$width>
                        <a target='_blank' href='{$this->getDomain()}/#/afol/eventTheme.html'><img src='{$this->getDomain()}/images/emails/navigation/email_header_03.gif'></a>
                    </td>
                    <td align=center width=$width>
                        <a target='_blank' href='{$this->getDomain()}/#/afol/eventGames.html'><img src='{$this->getDomain()}/images/emails/navigation/email_header_04.gif'></a>
                    </td>
                </tr>
                {$this->getTableFooter()}
            ";
        }

        private function getFirstLineSpoiler() {
            return "
                {$this->getTableHeader()}
                <tr>
                    <td align=left>
                        {$this->getFontWrapper()}
                        <b> BrickSlopes -- A LEGO Fan Event&trade;. Home of <i>endless</i> Swag&trade;</b>
                        {$this->getFontClosure()}
                    </td>
                </tr>
                {$this->getTableFooter()}
            ";
        }

        private function getBSLogo() {
            return "
                {$this->getTableHeader('#000000')}
                <tr>
                    <td align=right>
                        <div style='padding-right:25px'>
                            <img src='{$this->getDomain()}/images/brickslopes_official.png'>
                        </div>
                    </td>
                </tr>
                {$this->getTableFooter()}
            ";
        }

        private function getCopyRight() {
            return "
                {$this->getTableHeader()}
                <tr>
                    <td algin=center>
                        {$this->getFontWrapper()}
                            Copyright © BRICKSLOPES • SBC Corporation 2013-2014<br>
                            BrickSlopes, BrickSlopes -- A LEGO Fan Event&trade; and Home of <i>endless</i> Swag are registered trademarks of SBC Corporation.<br>
                            LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize, or endorse this event or site. LEGOLAND® is a Merlin Entertainments Group Attraction which does not sponsor, authorize or endorse this event or site. 
                        {$this->getFontClosure()}
                    </td>
                </tr>
                {$this->getTableFooter()}
            ";
        }

        private function getDisclaimer() {
            return "
                {$this->getTableHeader()}
                <tr>
                    <td algin=center>
                        {$this->getFontWrapper()}
                            You are receiving this email because you signed up to receive emails at {$this->getDomain()}. If you no longer wish to receive our email updates, please click here.<br>
                            The information contained in this communication is confidential. This communication is intended only for the use of the addressee ({$this->email}). If you are not the intended recipient, please notify legal@brickslopes.com promptly and delete the message.<br>Any distribution or copying of this message without the consent of BrickSlopes is prohibited.
                        {$this->getFontClosure()}
                    </td>
                </tr>
                {$this->getTableFooter()}
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
