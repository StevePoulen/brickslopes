<?php

    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once join('/', array(__DIR__, '..', '..', 'app','php', 'AutoLoader.php'));
    require_once join('/', array(__DIR__, '..', '..', 'config', 'config.php'));

    class migrateDatabases {
        private $validObj;

        public function __construct() {
            $this->validObj = new db();
            $this->runMigrations();
        }

        private function runMigrations() {
            $eventId = $this->addInitialEvents();
            $this->migrateUsers($eventId);
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

        private function addInitialEvents() {
            $eventsObj = new events();
            $eventMap = Array();
            $eventMap['name'] = 'BrickSlopes';
            $eventMap['city'] = 'Salt Lake City';
            $eventMap['state'] = 'Utah';
            $eventMap['year'] = '2014';
            $eventMap['cost'] = '65.00';
            $eventMap['discount'] = '60.00';
            $eventMap['meetAndGreetCost'] = '10.00';
            $eventMap['discountDate'] = '2014-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);
            $firstYearEventId = $eventId;

            $this->validateTable('events', 1);

            $eventDatesObj = new eventDates();
            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-01 8:00:00',
                'endDate' => '2014-05-01 20:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-02 10:00:00',
                'endDate' => '2014-05-02 23:59:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-03 9:00:00',
                'endDate' => '2014-05-03 20:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2014-05-04 8:00:00',
                'endDate' => '2014-05-04 12:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $this->validateTable('eventDates', 4);

            $eventsObj = new events();
            $eventMap = Array();
            $eventMap['name'] = 'BrickSlopes';
            $eventMap['city'] = 'Salt Lake City';
            $eventMap['state'] = 'Utah';
            $eventMap['year'] = '2015';
            $eventMap['cost'] = '65.00';
            $eventMap['discount'] = '60.00';
            $eventMap['meetAndGreetCost'] = '10.00';
            $eventMap['discountDate'] = '2015-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);

            $this->validateTable('events', 2);

            $eventDatesObj = new eventDates();
            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-01 8:00:00',
                'endDate' => '2015-05-01 20:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-02 10:00:00',
                'endDate' => '2015-05-02 23:59:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-03 9:00:00',
                'endDate' => '2015-05-03 20:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $eventDatesMap = array (
                'eventId' => $eventId,
                'startDate' => '2015-05-04 8:00:00',
                'endDate' => '2015-05-04 12:00:00',
                'type' => 'afol'
            );
            $eventDatesObj->addEventDates($eventDatesMap);

            $this->validateTable('eventDates', 8);

            return $firstYearEventId;
        }

        private function migrateUsers($eventId) {
            $usersObj = new users();
            $afolsObj = new afols();
            $registrationsObj = new registrations();
            $afolsObj->selectAllAfols(); 

            if ($afolsObj->result) {
                while ($dbObj = $afolsObj->result->fetch_object()) {
                    $userMap = array();
                    $userMap['firstName'] = $this->trimMigration($dbObj->firstName);
                    $userMap['lastName'] = $this->trimMigration($dbObj->lastName);
                    $userMap['email'] = $this->trimMigration($dbObj->email);
                    $userMap['password'] = \base_convert(rand(78364164096, 2821109907455), 10, 36);
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
                    $registrationMap['type'] = 'afol';

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
