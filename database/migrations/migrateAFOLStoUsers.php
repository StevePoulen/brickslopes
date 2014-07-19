<?php

    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once join('/', array(__DIR__, '..', '..', 'app','php', 'AutoLoader.php'));
    require_once join('/', array(__DIR__, '..', '..', 'config', 'config.php'));

    class migrateDatabases {
        private $validObj;
        private $firstYearEventId;
        private $secondYearEventId;

        public function __construct() {
            $this->validObj = new db();
            $this->runMigrations();
        }

        private function runMigrations() {
            $this->addInitialEvents();
            $this->migrateUsers($this->firstYearEventId);
            $this->addInitialThemes($this->secondYearEventId);
            if ($_SERVER['HTTP_HOST'] == 'mybrickslopes.com') {
                $this->addDummyMocs();
            }
        }


        private function getTableCount($table) {
            return $this->validObj->query("select * from $table");
        }

        private function validateTable($table, $expectedCount) {
            $actualCount = $this->getTableCount($table);
            if ($expectedCount != $actualCount) {
                echo "\n\n\t\t********* Error **********\n\n";
                die("Unable to valid $table. Actual: $actualCount != Expected: $expectedCount\n");
            } else {
                echo "VALID - '$table'\n";
            }
        }

        private function addRegistrationEventPass($eventId, $userId) {
            $this->addRegistrationLineItem($eventId, $userId, 'Event Pass', '65.00');
        }

        private function addRegistrationTShirt($eventId, $userId) {
            $this->addRegistrationLineItem($eventId, $userId, 'T-Shirt', '25.00', 'X-Large');
        }

        private function addRegistrationBrick($eventId, $userId) {
            $this->addRegistrationLineItem($eventId, $userId, 'brickLine1', '0.00', '', 'Brick Line 1');
        }

        private function addRegistrationLineItem($eventId, $userId, $lineItem, $amount, $size='', $description='') {
            $registrationLineItemObj = new registrationLineItemModel();
            $registrationLineItemMap['eventId'] = $eventId;
            $registrationLineItemMap['userId'] = $userId;
            $registrationLineItemMap['lineItem'] = $lineItem;
            $registrationLineItemMap['amount'] = $amount;
            $registrationLineItemMap['paid'] = 'NO';
            $registrationLineItemMap['discount'] = 'NO';
            $registrationLineItemMap['description'] = $description;
            $registrationLineItemMap['size'] = $size;
            $registrationLineItemMap['quantity'] = 1;
            $registrationLineItemMap['active'] = 'YES';

            $registrationLineItemObj->addRegistrationLineItems($registrationLineItemMap);
        }

        private function trimMigration($value) {
            $value = ltrim($value, ' ');
            return rtrim($value, ' ');
        }

        private function formatEnum($value) {
            if (preg_match('/yes/i', $value)) {
                return 'YES';
            } else {
                return 'NO';
            }
        }

        private function addDummyMocs() {
            $mocsObj = new mocModel();
            $mocsCount = 0;
            $themeId = 1;

            $mocsCollection = array(
                array(
                    'title' => 'My Cool Creation',
                    'mocImageUrl' => 'https://My_Cool_Creation.org',
                    'baseplateWidth' => 2,
                    'baseplateDepth' => 2,
                    'description' => 'I ruled this moc'
                ),
                array(
                    'title' => 'My Cool Creation -- Part II',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_II.org',
                    'baseplateWidth' => 4,
                    'baseplateDepth' => 4,
                    'description' => 'I ruled this moc a lot'
                )
            );

            foreach ($mocsCollection as $mocMap) {
                $mocMap = array(
                    'userId' => 1,
                    'eventId' => 2,
                    'themeId' => $themeId++,
                    'displayName' => 'Brian Pilati',
                    'title' => $mocMap['title'],
                    'mocImageUrl' => $mocMap['mocImageUrl'],
                    'baseplateWidth' => $mocMap['baseplateWidth'],
                    'baseplateDepth' => $mocMap['baseplateDepth'],
                    'description' => $mocMap['description']
                );

                $mocId = $mocsObj->addMocInformation($mocMap);
                $mocsCount++;
            }

            $this->validatetable('mocs', $mocsCount);

        }

        private function addInitialThemes($eventId) {
            $themesObj = new themesModel();
            $themeAwardsObj = new themeAwards();
            $themesCount = 0;
            $themeAwardsCount = 0;

            $themesCollection = array(
                array(
                    'theme' => 'Adventure',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best Pirate',
                        'Best Steam Punk',
                        'Best Non-Motorized Vehicle',
                    )
                ),
                array(
                    'theme' => 'Bionicle',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Bionicle',
                        'Best use of Bionicle Parts'
                    )
                ),
                array(
                    'theme' => 'The BCS Awards',
                    'type' => 'AFOL',
                    'awards' => array (
                        "Brian's Choice Award",
                        "Cody's Choice Award",
                        "Steve's Choice Award"
                    )
                ),
                array(
                    'theme' => 'Castle',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Castle',
                        'Best Historical',
                        'Best War Machine'
                    )
                ),
                array(
                    'theme' => 'City & Train',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of City & Train',
                        'Most Original Building',
                        'Best Skyscraper',
                        'Best Custom/Original',
                        'Most Attention to Detail'
                    )
                ),
                array(
                    'theme' => 'NPU (Nice Part Usage)',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best NPU'
                    )
                ),
                array(
                    'theme' => 'Pop Culture',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Pop Culture',
                        'Best Movie Scene'
                    )
                ),
                array(
                    'theme' => 'Princess',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best Princess Theme'
                    )
                ),
                array(
                    'theme' => 'Sculpture / Mosiac',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best Sculpture',
                        'Best Mosaic',
                        'Best Small Art'
                    )
                ),
                array(
                    'theme' => 'Space',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Space',
                        'Best Space Base',
                        'Best Original Spaceship'
                    )
                ),
                array(
                    'theme' => 'Technic',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Technic',
                        'Best Use of Motion',
                        'Best Great Ball Contraption'
                    )
                ),
                array(
                    'theme' => 'Vignette',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best Vignette',
                        'Best Custom Fig'
                    )
                ),
                array(
                    'theme' => 'Public Choice',
                    'type' => 'PUBLIC',
                    'awards' => array (
                        '1st Place by Public Vote',
                        '2nd Place by Public Vote',
                        '3rd Place by Public Vote'
                    )
                )
            );

            foreach ($themesCollection as $themesMap) {
                $themeMap = array(
                    'theme' => $themesMap['theme'],
                    'type' => $themesMap['type'],
                    'eventId' => $eventId
                );
                $themeId = $themesObj->addThemeInformation($themeMap);
                $themesCount++;
                $place = 1;
                foreach ($themesMap['awards'] as $themeAward) {
                    $themeAwardMap = array ('award' => $themeAward);
                    $themeAwardMap['themeId'] = $themeId;
                    $themeAwardMap['place'] = $place++;
                    $themeAwardsObj->addThemeAwardInformation($themeAwardMap);
                    $themeAwardsCount++;
                }

            }

            $this->validatetable('themes', $themesCount);
            $this->validatetable('themeAwards', $themeAwardsCount);
        }

        private function addInitialEvents() {
            $eventsObj = new events();
            $eventMap = Array();
            $eventMap['name'] = 'BrickSlopes - Salt Lake City';
            $eventMap['city'] = 'Salt Lake City';
            $eventMap['state'] = 'Utah';
            $eventMap['year'] = '2014';
            $eventMap['cost'] = '65.00';
            $eventMap['discount'] = '60.00';
            $eventMap['tShirtDiscount'] = '15.00';
            $eventMap['tShirtCost'] = '20.00';
            $eventMap['meetAndGreetDiscount'] = '10.00';
            $eventMap['meetAndGreetCost'] = '15.00';
            $eventMap['discountDate'] = '2014-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);
            $this->firstYearEventId = $eventId;

            $this->validateTable('events', 1);

            $eventDatesObj = new eventDatesModel();
            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-01 8:00:00',
                'endDate' => '2014-05-01 20:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-02 10:00:00',
                'endDate' => '2014-05-02 23:59:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-03 9:00:00',
                'endDate' => '2014-05-03 20:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-04 8:00:00',
                'endDate' => '2014-05-04 12:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $this->validateTable('eventDates', 4);

            $eventsObj = new events();
            $eventMap = Array();
            $eventMap['name'] = 'BrickSlopes - Salt Lake City';
            $eventMap['city'] = 'Salt Lake City';
            $eventMap['state'] = 'Utah';
            $eventMap['year'] = '2015';
            $eventMap['tShirtDiscount'] = '15.00';
            $eventMap['tShirtCost'] = '20.00';
            $eventMap['cost'] = '65.00';
            $eventMap['discount'] = '60.00';
            $eventMap['meetAndGreetDiscount'] = '10.00';
            $eventMap['meetAndGreetCost'] = '15.00';
            $eventMap['discountDate'] = '2015-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);
            $this->secondYearEventId = $eventId;

            $this->validateTable('events', 2);

            $eventDatesObj = new eventDatesModel();
            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-14 8:00:00',
                'endDate' => '2015-05-14 20:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-15 10:00:00',
                'endDate' => '2015-05-15 23:59:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-16 9:00:00',
                'endDate' => '2015-05-16 20:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-17 8:00:00',
                'endDate' => '2015-05-17 12:00:00',
                'type' => 'AFOL'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-15 15:00:00',
                'endDate' => '2015-05-15 20:00:00',
                'type' => 'PUBLIC'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-16 9:00:00',
                'endDate' => '2015-05-16 20:00:00',
                'type' => 'PUBLIC'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $this->validateTable('eventDates', 10);
        }

        private function migrateUsers($eventId) {
            $usersObj = new users();
            $afolsObj = new afols();
            $registrationsObj = new registrations();
            $afolsObj->selectAllAfols(); 
            $noEmailCounter = 0;
            $registrationCounter = 0;
            $junkCounter = 11;

            if ($afolsObj->result) {
                while ($dbObj = $afolsObj->result->fetch_object()) {
                    if (
                        empty($dbObj->email) ||
                        $dbObj->afolsId == 139 ||
                        $dbObj->afolsId == 143 ||
                        $dbObj->afolsId == 144 ||
                        $dbObj->afolsId == 145 ||
                        $dbObj->afolsId == 146 ||
                        $dbObj->afolsId == 147
                    ) {
                        $noEmailCounter++;
                        continue;
                    }
                    $userMap = array();
                    $userMap['firstName'] = $this->trimMigration($dbObj->firstName);
                    $userMap['lastName'] = $this->trimMigration($dbObj->lastName);
                    $userMap['email'] = $this->trimMigration($dbObj->email);
                    if ($userMap['email'] == 'brianpilati@gmail.com') {
                        $userMap['password'] = '12345678';
                        $userMap['admin'] = 'YES';
                    } else if ($userMap['email'] == 'blakedhansen@gmail.com') {
                        $userMap['password'] = '*DDC9439917095E5A5EABE833DCB8399EAD3FCF31';
                    } else if ($userMap['email'] == 'blackdragon5555@hotmail.com') {
                        $userMap['admin'] = 'YES';
                        $userMap['password'] = '12345678';
                    } else if ($userMap['email'] == 'spoulsen.sp@gmail.com') {
                        $userMap['admin'] = 'YES';
                        $userMap['password'] = '12345678';
                    } else {
                        $userMap['password'] = \base_convert(rand(78364164096, 2821109907455), 10, 36);
                    }
                    $userMap['address'] = $this->trimMigration($dbObj->address);
                    $userMap['city'] = $this->trimMigration($dbObj->city);
                    $userMap['state'] = $this->trimMigration($dbObj->state);
                    $userMap['zipcode'] = $this->trimMigration($dbObj->zipcode);
                    $userMap['flickr'] = $this->trimMigration($dbObj->flickr);
                    $userMap['phoneNumber'] = "";
                    $userId = $usersObj->addUserInformation($userMap);

                    if (preg_match('/^Duplicate entry/', $userId)) {
                        $userMap['email'] = $userMap['email'] . "_dup";
                        if($userMap['email'] == 'ENeuman600@gmail.com_dup') {
                            $userMap['familyId'] = 21;
                        } else if($userMap['email'] == 'r184120@yahoo.com_dup') {
                            $userMap['familyId'] = 26;
                        } else if($userMap['email'] == 'rman_333@hotmail.com_dup') {
                            $userMap['familyId'] = 52;
                        }
                        $userId = $usersObj->addUserInformation($userMap);
                    }

                    $usersObj->updateUserInformation($userId, $userMap);

                    $registrationMap = array();
                    $registrationMap['userId'] = $userId;
                    $registrationMap['eventId'] = $eventId;
                    //$registrationMap['badgeLine1'] = $dbObj->badgeLine1;
                    //$registrationMap['badgeLine2'] = $dbObj->badgeLine2;
                    //$registrationMap['meetAndGreet'] = $this->formatEnum($dbObj->meetAndGreet);
                    $registrationMap['ageVerification'] = $this->formatEnum($dbObj->ageVerification);
                    $registrationMap['comments'] = $dbObj->comments;
                    $registrationMap['amountPaid'] = '55.00';
                    //$registrationMap['tShirtSize'] = 'XL';
                    //$registrationMap['tShirtPaid'] = '20.00';
                    $registrationMap['type'] = 'AFOL';

                    $registrationsObj->addRegistrationInformation($registrationMap);

                    if ($_SERVER['HTTP_HOST'] === 'mybrickslopes.com') {
                        if ($userId == 21 || $userId == 26 || $userId == 52) {
                            $registrationCounter++;
                            $registrationMap['eventId'] = 2;
                            $registrationsObj->addRegistrationInformation($registrationMap);
                            $this->addRegistrationEventPass(2,$userId);
                            $this->addRegistrationTShirt(2,$userId);
                            $this->addRegistrationBrick(2,$userId);
                        }
                    }

                }
            }

            $originalAfolCount = $this->getTableCount('afols') - ($noEmailCounter + $junkCounter);
            $originalRegistrationCount = $originalAfolCount + $registrationCounter;
            $this->validateTable('users', $originalAfolCount);
            $this->validateTable('registrations', $originalRegistrationCount);
        }
    }

    new migrateDatabases();
?>
