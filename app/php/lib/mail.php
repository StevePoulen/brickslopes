<?php
    class mail {
        public function __construct($creatorId) {
            $this->message = "";
            $this->subject = "";
            $this->creatorId = $creatorId;
            $this->emailHistoryObj = new emailHistory();
        }

        public function sendEmailTest($email) {
            $this->subject = "BrickSlopes Question Time: " . time();
            $this->message = "
                <!doctype html>
                <html>
                    <head>
                        <title>BrickSlopes Question</title>
                    </head>
                    <body>
                        {$this->getFontWrapper(24, '#FF0000')}
                        Test Email - 24 Font, Red, <b>Bold</b>, <i>Italics</i> and <u>Underlined</u>
                        {$this->getFontClosure()}
            ";

            $this->message .= $this->getDisclaimer($email);

            $this->message .= "
                    </body>
                </html>
            ";

            return array (
                'subject' => $this->subject,
                'body' => $this->message,
                'email' => $email
            );

        }

        public function sendEmailUsMessage($data) {
            $this->subject = "BrickSlopes Question";
            $this->message = "
                <!doctype html>
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

            $this->message .= $this->getDisclaimer('brian@brickslopes.com');

            $this->message .= "
                    </body>
                </html>
            ";

            $this->emailHistoryObj->addEmailHistoryInformation (
                array (
                    'creatorId' => $this->creatorId,
                    'recipientId' => 1,
                    'type' => __METHOD__,
                    'priority' => 10,
                    'emailAddress' => 'undetermined',
                    'subject' => $this->subject,
                    'body' => $this->message
                )
            );
        }

        public function sendUserRegistrationMessage($userId, $display=false) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            if($usersObj->result) {
                while($dbObj = $usersObj->result->fetch_object()) {
                    $this->subject = "BrickSlopes User Registration";
                    $this->message = "
                        <!doctype html>
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
                                            {$dbObj->firstName},
                                            <p>
                                            <b>Congratulations!</b> This e-mail confirms you are a registered member of BrickSlopes - A LEGO Fan Event&trade;.
                                            <p>
                                            {$this->getPleaseVisit()}
                                        {$this->getFontClosure()}
                                    </td>
                                </tr>
                                {$this->getTableFooter()}
                                {$this->getDisclaimer($dbObj->email)}
                                {$this->getCopyRight($dbObj->email)}
                                {$this->getDivClosure()}
                            </body>
                        </html>
                    ";

                    if ($display) {
                        return $this->message;
                    } else {
                        $this->emailHistoryObj->addEmailHistoryInformation (
                            array (
                                'creatorId' => $this->creatorId,
                                'recipientId' => $dbObj->userId,
                                'type' => __METHOD__,
                                'priority' => 1,
                                'emailAddress' => $dbObj->email,
                                'subject' => $this->subject,
                                'body' => $this->message
                            )
                        );
                    }
                }
            }
        }

        public function sendEventRegistrationMessage($userId, $eventId, $display=false) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            $registrationLineItemsObj = new registrationLineItems($userId, false);
            $lineItems = $registrationLineItemsObj->getRegisteredLineItems($userId, $eventId);
            if($usersObj->result) {
                while($dbObj = $usersObj->result->fetch_object()) {
                    $this->subject = "BrickSlopes Registration";
                    $this->message = "
                        <!doctype html>
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
                                            <b>Congratulations!</b> This e-mail confirms you are registered for BrickSlopes 2015 - Salt Lake City.
                                            <p>
                                            You will receive a confirmation e-mail once your payment is received and your registration is complete.
                                            <p>
                                            <b>Your Event Experience</b>
                                            {$this->parseLineItems($lineItems)}
                                            <p>
                                            <b>Have You Considered?</b>
                                            <p>
                                            We need LEGO presenters and panels speakers. Do you have a topic you are passionate about and are willing to share with the community? 
                                            <p>
                                            <b>Let the fun begin ...</b>
                                            <p>
                                            Dont' forget to sign-up to bring your MOCs or register for event games.
                                            <p>
                                            <p>
                                            {$this->getPleaseVisit()}
                                        {$this->getFontClosure()}
                                    </td>
                                </tr>
                                {$this->getTableFooter()}
                                {$this->getDisclaimer($dbObj->email)}
                                {$this->getCopyRight($dbObj->email)}
                                {$this->getDivClosure()}
                            </body>
                        </html>
                    ";

                    if ($display) {
                        return $this->message;
                    } else {
                        $this->emailHistoryObj->addEmailHistoryInformation (
                            array (
                                'creatorId' => $this->creatorId,
                                'recipientId' => $dbObj->userId,
                                'type' => __METHOD__,
                                'priority' => 3,
                                'emailAddress' => $dbObj->email,
                                'subject' => $this->subject,
                                'body' => $this->message
                            )
                        );
                    }
                }
            }
        }

        public function sendVendorRegistrationMessage($userId, $eventId, $display=false) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            $registrationLineItemsObj = new registrationLineItems($userId, false);
            $lineItems = $registrationLineItemsObj->getRegisteredLineItems($userId, $eventId);
            if($usersObj->result) {
                while($dbObj = $usersObj->result->fetch_object()) {

                    $this->subject = "BrickSlopes Vendor Registration";
                    $this->message = "
                        <!doctype html>
                        <html>
                            <head>
                                <title>BrickSlopes Vendor Registration</title>
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
                                            <b>Congratulations!</b> This e-mail confirms you have submitted a request to be a vendor at BrickSlopes 2015 - Salt Lake City.
                                            </P
                                            <p>
                                            You will receive a confirmation e-mail when your payment is received and your registration is complete. 
                                            </p>
                                            <p>
                                            BrickSlopes does limit the number of vendors, so sending your payment early will help secure a booth.
                                            </p>
                                            <p>
                                            <b>Your Event Experience</b>
                                            {$this->parseLineItems($lineItems)}
                                            <p>
                                            </p>
                                            <b>Have You Considered?</b>
                                            <p>
                                            We need LEGO presenters and panels speakers. Do you have a topic you are passionate about and are willing to share with the community? 
                                            </p>
                                            <p>
                                            <b>Let the fun begin ...</b>
                                            </p>
                                            <p>
                                            Dont' forget to sign-up to bring your MOCs or register for event games.
                                            </p>
                                            <p>
                                            {$this->getPleaseVisit()}
                                        {$this->getFontClosure()}
                                    </td>
                                </tr>
                                {$this->getTableFooter()}
                                {$this->getDisclaimer($dbObj->email)}
                                {$this->getCopyRight($dbObj->email)}
                                {$this->getDivClosure()}
                            </body>
                        </html>
                    ";

                    if ($display) {
                        return $this->message;
                    } else {
                        $this->emailHistoryObj->addEmailHistoryInformation (
                            array (
                                'creatorId' => $this->creatorId,
                                'recipientId' => $dbObj->userId,
                                'type' => __METHOD__,
                                'priority' => 4,
                                'emailAddress' => $dbObj->email,
                                'subject' => $this->subject,
                                'body' => $this->message
                            )
                        );
                    }
                }
            }
        }

        public function sendRegistrationPaidMessage($userId, $eventId, $display=false) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            $registrationLineItemsObj = new registrationLineItems($userId, false);
            $lineItems = $registrationLineItemsObj->getRegisteredLineItems($userId, $eventId);
            if($usersObj->result) {
                $dbObj = $usersObj->result->fetch_object();

                $this->subject = "BrickSlopes Registration Complete";
                $this->message = "
                    <!doctype html>
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
                                            {$dbObj->firstName},
                                            <p>
                                            Thank you for your payment. Your BrickSlopes 2015 - Salt Lake City registration is now complete.
                                            <p>
                                            <b>Your Event Experience</b>
                                            {$this->parseLineItems($lineItems)}
                                            <p>
                                            <b>Have You Considered?</b>
                                            <p>
                                            We need LEGO presenters and panels speakers. Do you have a topic you are passionate about and are willing to share with the community? 
                                            <p>
                                            <b>Let the fun begin ...</b>
                                            <p>
                                            Dont' forget to sign-up to bring your MOCs or register for event games.
                                            <p>
                                            {$this->getPleaseVisit()}
                                        {$this->getFontClosure()}
                                    </td>
                                </tr>
                            {$this->getTableFooter()}
                            {$this->getDisclaimer($dbObj->email)}
                            {$this->getCopyRight($dbObj->email)}
                            {$this->getDivClosure()}
                        </body>
                    </html>
                ";

                if ($display) {
                    return $this->message;
                } else {
                    $this->emailHistoryObj->addEmailHistoryInformation (
                        array (
                            'creatorId' => $this->creatorId,
                            'recipientId' => $dbObj->userId,
                            'type' => __METHOD__,
                            'priority' => 2,
                            'emailAddress' => $dbObj->email,
                            'subject' => $this->subject,
                            'body' => $this->message
                        )
                    );
                }
            }
        }

        public function sendResetEmailMessage($userId, $newPassword, $display=false) {
            $usersObj = new users();
            $usersObj->getUserInformation($userId);
            if($usersObj->result) {
                while($dbObj = $usersObj->result->fetch_object()) {
                    $this->subject = "BrickSlopes Reset Password Request";
                    $this->message = "
                        <!doctype html>
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
                                                {$dbObj->firstName},
                                                <p>
                                                You are receiving this e-mail because you have requested to reset your password.
                                                <p>
                                                Your new temporary password is: <b>{$newPassword}</b>
                                                <p>
                                                <a href='{$this->getDomain()}/#/afol/login.html' target='_blank'>{$this->getDomain()}</a> to reset your password.
                                            {$this->getFontClosure()}
                                        </td>
                                    </tr>
                                {$this->getTableFooter()}
                                {$this->getDisclaimer($dbObj->email)}
                                {$this->getCopyRight($dbObj->email)}
                                {$this->getDivClosure()}
                            </body>
                        </html>
                    ";

                    if ($display) {
                        return $this->message;
                    } else {
                        $this->emailHistoryObj->addEmailHistoryInformation (
                            array (
                                'creatorId' => $this->creatorId,
                                'recipientId' => $dbObj->userId,
                                'type' => __METHOD__,
                                'priority' => 0,
                                'emailAddress' => $dbObj->email,
                                'subject' => $this->subject,
                                'body' => $this->message
                            )
                        );
                    }
                }
            }
        }

        public function sendSiteNewsMessage($body, $display=false) {
            $usersObj = new users();
            if ($display) {
                $usersObj->getUserInformation(1); //This is my user
            } else {
                $usersObj->getAllUserInformation();
            }
            while($dbObj = $usersObj->result->fetch_object()) {
                $this->subject = "BrickSlopes News Announcement";
                $this->message = "
                    <!doctype html>
                    <html>
                        <head>
                            <title>BrickSlopes News Announcement</title>
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
                                        {$body}
                                        {$this->getPleaseVisit()}
                                    {$this->getFontClosure()}
                                </td>
                            </tr>
                            {$this->getTableFooter()}
                            {$this->getDisclaimer($dbObj->email)}
                            {$this->getCopyRight($dbObj->email)}
                            {$this->getDivClosure()}
                        </body>
                    </html>
                ";

                if ($display) {
                    return $this->message;
                } else {
                    $this->emailHistoryObj->addEmailHistoryInformation (
                        array (
                            'creatorId' => $this->creatorId,
                            'recipientId' => $dbObj->userId,
                            'type' => __METHOD__,
                            'priority' => 9,
                            'emailAddress' => $dbObj->email,
                            'subject' => $this->subject,
                            'body' => $this->message
                        )
                    );
                }
            }
        }

        private function getFontFamily() {
            return "FONT-FAMILY:Arial,Helvetica,Verdana,sans-serif;";

        }

        private function getEmailBackgroundHeader() {
            return "
                <div style='width:auto; height:auto; border-radius:10px; background:#FFFFFF; border:5px solid black; {$this->getFontFamily()} bgcolor:#FFFFFF;'>
            ";
        }

        private function getDivClosure() {
            return "
                </div>
            ";
        }

        private function parseLineItems($lineItems) {
            $message = $this->getTableHeader('#FFFFFF', 1, 600, 0);

            $message .= "
                <tr>
                    <th align='center'>
                        Item
                    </th>
                    <th align='center'>
                        Quantity 
                    </th>
                    <th align='center'>
                        Amount 
                    </th>
                    <th align='center'>
                        Total 
                    </th>
                </tr>
            ";

            foreach($lineItems['lineItems'] as $lineItem) {
                $message .= "
                    <tr>
                        <td align='center'>
                            {$lineItem['lineItem']}
                        </td>
                        <td align='center'>
                            {$lineItem['quantity']}
                        </td>
                        <td align='right'>
                            \${$lineItem['amount']}
                        </td>
                        <td align='right'>
                            \${$lineItem['total']}
                        </td>
                    </tr>
                ";
            }

            $message .= "
                <tr>
                    <td align='right' colspan=3>
                        <b>Total &nbsp; &nbsp;</b>
                    </td>
                    <td align='right'>
                        <b>\${$lineItems['total']}</b>
                    </td>
                </tr>
            ";

            $message .= "
                {$this->getTableFooter()}
            ";

            return $message;
        }

        private function getPleaseVisit() {
            return "
                <b>Need more LEGO goodness?</b>
                <p>
                Then get over to <a href='{$this->getDomain()}' target='_blank'>{$this->getDomain()}</a> for more information about
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


        private function getTableHeader($bgColor="#FFFFFF", $border=0, $width=800, $padding=10) {
            return "
                <table width=100%>
                    <tbody>
                        <tr>
                            <td align=center>
                                <table width='{$width}' cellspacing='0' cellpadding='0' border='{$border}' align='center' style='padding-bottom:{$padding}px;' bgcolor='$bgColor'>
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
             //<b> BrickSlopes -- A LEGO Fan Event&trade;. Home of <i>endless</i> Swag&trade;</b>
            return "
                {$this->getTableHeader()}
                <tr>
                    <td align=left>
                        {$this->getFontWrapper()}
                        <b> BrickSlopes -- A LEGO Fan Event&trade;.<b>
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

        private function getCopyRight($email) {
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

        private function getDisclaimer($email) {
            return "
                {$this->getTableHeader()}
                <tr>
                    <td algin=center>
                        {$this->getFontWrapper()}
                            You are receiving this email because you signed up to receive emails at {$this->getDomain()}. If you no longer wish to receive our email updates, please click here.<br>
                            The information contained in this communication is confidential. This communication is intended only for the use of the addressee ({$email}). If you are not the intended recipient, please notify legal@brickslopes.com promptly and delete the message.<br>Any distribution or copying of this message without the consent of BrickSlopes is prohibited.
                        {$this->getFontClosure()}
                    </td>
                </tr>
                {$this->getTableFooter()}
            ";
        }

        private function getDomain() {
            return "https://www." . WEBSITE;
        }
    }
?>
