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
                    'theme' => 'Castle',
                    'type' => 'AFOL',
                    'awards' => array (
                        'Best of Castle',
                        'Best Historical',
                        'Best'
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
                        'Best Princess Theme',
                        'Best Movie Scene'
                    )
                ),
                array(
                    'theme' => 'Sculpture / Mosiac',
                    'type' => 'PUBLIC',
                    'awards' => array (
                        'Best Sculpture',
                        'Best Mosaic',
                        'Best Small Art'
                    )
                ),
                array(
                    'theme' => 'Space',
                    'type' => 'PUBLIC',
                    'awards' => array (
                        'Best of Space',
                        'Best Space Base',
                        'Best Original Spaceship'
                    )
                ),
                array(
                    'theme' => 'Technic',
                    'type' => 'PUBLIC',
                    'awards' => array (
                        'Best of Technic',
                        'Best Use of Motion',
                        'Best Great Ball Contraption'
                    )
                ),
                array(
                    'theme' => 'Vignette',
                    'type' => 'PUBLIC',
                    'awards' => array (
                        'Best Vignette',
                        'Best Custom Fig'
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

            if ($afolsObj->result) {
                while ($dbObj = $afolsObj->result->fetch_object()) {
                    if (empty($this->trimMigration($dbObj->email))) {
                        continue;
                    }
                    $userMap = array();
                    $userMap['firstName'] = $this->trimMigration($dbObj->firstName);
                    $userMap['lastName'] = $this->trimMigration($dbObj->lastName);
                    $userMap['email'] = $this->trimMigration($dbObj->email);
                    if ($userMap['email'] == 'brianpilati@gmail.com') {
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
                    $usersObj->updateUserInformation($userId, $userMap);

                    $registrationMap = array();
                    $registrationMap['userId'] = $userId;
                    $registrationMap['eventId'] = $eventId;
                    $registrationMap['badgeLine1'] = $dbObj->badgeLine1;
                    $registrationMap['badgeLine2'] = $dbObj->badgeLine2;
                    $registrationMap['meetAndGreet'] = $this->formatEnum($dbObj->meetAndGreet);
                    $registrationMap['ageVerification'] = $this->formatEnum($dbObj->ageVerification);
                    $registrationMap['comments'] = $dbObj->comments;
                    $registrationMap['amountPaid'] = '55.00';
                    $registrationMap['type'] = 'AFOL';

                    $registrationsObj->addRegistrationInformation($registrationMap);
                }
            }

            $originalAfolCount = $this->getTableCount('afols');
            $this->validateTable('users', $originalAfolCount);
            $this->validateTable('registrations', $originalAfolCount);
        }
    }

    new migrateDatabases();
?>
