<?php

    $_SERVER['HTTP_HOST'] = 'mybrickslopes.com';
    include_once join('/', array(__DIR__, '..', '..', 'app','php', 'AutoLoader.php'));
    require_once join('/', array(__DIR__, '..', '..', 'config', 'config.php'));

    class migrateDatabases {
        private $validObj;
        private $firstYearEventId;
        private $secondYearEventId;
        private $imageUrl;

        public function __construct() {
            $this->validObj = new db();
            $this->imageUrl = "https://www." . ($_SERVER['HTTP_HOST'] == 'mybrickslopes.com' ? 'mybrickslopes.com' : 'brickslopes.com') . "/images/games/";
            $this->runMigrations();
        }

        private function runMigrations() {
            $this->addInitialEvents();
            $this->migrateUsers($this->firstYearEventId);
            $this->addInitialThemes($this->secondYearEventId);
            $this->addInitialGames($this->secondYearEventId);
            if ($_SERVER['HTTP_HOST'] == 'mybrickslopes.com') {
                $this->addDummyMocs();
                $this->addDummyVendors();
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
            $this->addRegistrationLineItem(1, $eventId, $userId, 'Event Pass', '65.00');
        }

        private function addRegistrationTShirt($eventId, $userId) {
            $this->addRegistrationLineItem(2, $eventId, $userId, 'T-Shirt', '25.00', 'X-Large');
        }

        private function addRegistrationBrick($eventId, $userId) {
            $this->addRegistrationLineItem(5, $eventId, $userId, 'brickLine1', '0.00', '', 'Brick Line 1');
        }

        private function addRegistrationLineItem($eventLineItemCodeId, $eventId, $userId, $lineItem, $amount, $size='', $description='') {
            $registrationLineItemObj = new registrationLineItemModel();
            $registrationLineItemMap['eventLineItemCodeId'] = $eventLineItemCodeId;
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
            $registrationLineItemMap['isOwner'] = 'YES';

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

        private function addDummyVendors() {
            $vendorObj = new vendorModel();
            $storesCount = 0;
            $storeEventUserCount = 0;

            $vendorCollection = array(
                array(
                    'name' => 'The best store',
                    'description' => 'All LEGO -- ALL DAY -- EVERY DAY',
                    'url' => 'https://www.mysite.com',
                    'logo' => 'https://www.mylogo.com',
                    'type' => 'OWNER',
                    'tables' => 12,
                    'userId' => 2,
                    'eventId' => 2
                ),
                array(
                    'name' => 'The Worst store',
                    'description' => 'All Mega-Blah -- ALL DAY -- EVERY DAY',
                    'url' => 'https://www.yuck.com',
                    'logo' => '',
                    'type' => 'OWNER',
                    'tables' => 5,
                    'userId' => 10,
                    'eventId' => 2
                ),
                array(
                    'name' => 'The Empire',
                    'description' => 'All Star Wars -- ALL DAY -- EVERY DAY',
                    'url' => '',
                    'logo' => 'https://www.mybrickslopes.com/images/brickslopes_official.png',
                    'type' => 'OWNER',
                    'tables' => 3,
                    'userId' => 3,
                    'eventId' => 2
                )
            );

            foreach ($vendorCollection as $storeMap) {
                $storeId = $vendorObj->addStoreInformation($storeMap);
                $storeMap['storeId'] = $storeId;
                $storeId = $vendorObj->addTableInformation($storeMap);
                $storesCount++;
                $storeMap['type'] = 'ASSOCIATE';
                $storeMap['userId'] = $storeMap['userId'] + 5;
                $vendorObj->addStoreEventUserInformation($storeMap);
                $storeEventUserCount +=2;
            }

            $this->validatetable('stores', $storesCount);
            $this->validatetable('vendorConnector', $storesCount);
            $this->validatetable('storeEventConnector', $storesCount);
            $this->validatetable('storeEventUserConnector', $storeEventUserCount);

        }

        private function addDummyMocs() {
            $mocsObj = new mocModel();
            $mocsCount = 0;
            $themeId = 1;
            //Title => 47 Characters
            //Display Name => 33 Characters
            //Descripton => 147 Characters

            $mocsCollection = array(
                array(
                    'title' => 'My Cool Creation',
                    'userId' => '1',
                    'displayName' => 'BP',
                    'mocImageUrl' => 'https://My_Cool_Creation.org',
                    'baseplateWidth' => 1,
                    'baseplateDepth' => 1,
                    'description' => 'I ruled this moc'
                ),
                array(
                    'title' => 'My Cool Creation -- Part II',
                    'userId' => '1',
                    'displayName' => 'Brian',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_II.org',
                    'baseplateWidth' => 2,
                    'baseplateDepth' => 2,
                    'description' => 'I ruled this moc a lot'
                ),
                array(
                    'title' => 'My Cool Creation -- Part II twenty eight charac',
                    'userId' => '1',
                    'displayName' => 'Brian Pilati',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_III.org',
                    'baseplateWidth' => 3,
                    'baseplateDepth' => 3,
                    'description' => 'I ruled this moc a lot'
                ),
                array(
                    'title' => 'My Cool Creation -- Part II twenty eight charac',
                    'userId' => '1',
                    'displayName' => 'Brian Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_IV.org',
                    'baseplateWidth' => 4,
                    'baseplateDepth' => 4,
                    'description' => 'I ruled this moc a lot'
                ),
                array(
                    'title' => 'My Cool Creation -- Part III twenty eight chara',
                    'userId' => '1',
                    'displayName' => 'Brian Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_V.org',
                    'baseplateWidth' => 5,
                    'baseplateDepth' => 5,
                    'description' => 'I ruled this moc a lot'
                ),
                array(
                    'title' => 'My Cool Creation -- Part IV twenty eight charac',
                    'userId' => '2',
                    'displayName' => 'Ember Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_V.org',
                    'baseplateWidth' => 6,
                    'baseplateDepth' => 6,
                    'description' => 'I ruled this moc a lot'
                ),
                array(
                    'title' => 'My Cool Creation -- Part V twenty eight charact',
                    'userId' => '2',
                    'displayName' => 'Ember Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_VI.org',
                    'baseplateWidth' => 7,
                    'baseplateDepth' => 7,
                    'description' => 'I ruled this moc a lot. It was very hard to build but I persevered until it was finished. I only had to spend a million dollars to get it finished'
                ),
                array(
                    'title' => 'My Cool Creation -- Part VI twenty eight charac',
                    'userId' => '2',
                    'displayName' => 'Ember Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_VII.org',
                    'baseplateWidth' => 8,
                    'baseplateDepth' => 8,
                    'description' => 'I ruled this moc a lot. It was very hard to build but I persevered until it was finished. I only had to spend a million dollars to get it finished'
                ),
                array(
                    'title' => 'My Cool Creation -- Part VIII twenty eight char',
                    'userId' => '2',
                    'displayName' => 'Ember Pilati is my full-name than',
                    'mocImageUrl' => 'https://My_Cool_Creation_part_VIII.org',
                    'baseplateWidth' => 9,
                    'baseplateDepth' => 9,
                    'description' => 'I ruled this moc a lot. It was very hard to build but I persevered until it was finished. I only had to spend a million dollars to get it finished'
                )
            );

            foreach ($mocsCollection as $mocMap) {
                $mocMap = array(
                    'userId' => $mocMap['userId'],
                    'eventId' => 2,
                    'themeId' => $themeId++,
                    'displayName' => $mocMap['displayName'],
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
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best Pirate',
                        'Best Steam Punk',
                        'Best Non-Motorized Vehicle',
                    )
                ),
                array(
                    'theme' => 'Bionicle',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of Bionicle',
                        'Best use of Bionicle Parts'
                    )
                ),
                array(
                    'theme' => 'The BCS Awards',
                    'type' => 'AFOL',
                    'selectable' => 'NO',
                    'awards' => array (
                        "Brian's Choice Award",
                        "Cody's Choice Award",
                        "Steve's Choice Award"
                    )
                ),
                array(
                    'theme' => 'Castle',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of Castle',
                        'Best Historical',
                        'Best War Machine'
                    )
                ),
                array(
                    'theme' => 'City & Train',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of City & Train',
                        'Most Original Building',
                        'Best Skyscraper',
                        'Best Custom/Original Train',
                        'Most Attention to Detail'
                    )
                ),
                array(
                    'theme' => 'NPU (Nice Part Usage)',
                    'type' => 'AFOL',
                    'selectable' => 'NO',
                    'awards' => array (
                        'Best NPU'
                    )
                ),
                array(
                    'theme' => 'Pop Culture',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of Pop Culture',
                        'Best Movie Scene'
                    )
                ),
                array(
                    'theme' => 'Princess',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best Princess Theme'
                    )
                ),
                array(
                    'theme' => 'Sculpture / Mosiac',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best Sculpture',
                        'Best Mosaic',
                        'Best Small Art'
                    )
                ),
                array(
                    'theme' => 'Space',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of Space',
                        'Best Space Base',
                        'Best Original Spaceship'
                    )
                ),
                array(
                    'theme' => 'Technic',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best of Technic',
                        'Best Use of Motion',
                        'Best Great Ball Contraption'
                    )
                ),
                array(
                    'theme' => 'Vignette',
                    'type' => 'AFOL',
                    'selectable' => 'YES',
                    'awards' => array (
                        'Best Vignette',
                        'Best Custom Fig'
                    )
                ),
                array(
                    'theme' => 'Public Choice',
                    'type' => 'PUBLIC',
                    'selectable' => 'NO',
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
                    'selectable' => $themesMap['selectable'],
                    'eventId' => $eventId
                );
                $themeId = $themesObj->addThemeInformation($themeMap);
                $themesCount++;
                $place = 1;
                foreach ($themesMap['awards'] as $themeAward) {
                    $themeAwardMap = array (
                        'award' => $themeAward,
                        'eventId' => $eventId
                    );
                    $themeAwardMap['themeId'] = $themeId;
                    $themeAwardMap['place'] = $place++;
                    $themeAwardsObj->addThemeAwardInformation($themeAwardMap);
                    $themeAwardsCount++;
                }

            }

            $this->validatetable('themes', $themesCount);
            $this->validatetable('themeAwards', $themeAwardsCount);
        }

        private function addInitialGames($eventId) {
            $gamesObj = new gamesModel();
            $gameAwardsObj = new gameAwards();
            $gamesCount = 0;
            $gameAwardsCount = 0;

            $gamesCollection = array(
                array(
                    'game' => 'Swap Meet',
                    'description' => 'Bring as many bags of LEGO bricks as you want - any color, size, amount, quality, etc. -- and barter with other AFOLS. <p>The risks are high! What do you want and what are you willing to trade?',
                    'image' => $this->imageUrl . 'Swap-Meet-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES'
                ),
                array(
                    'game' => 'Skyscraper',
                    'description' => 'Build the tallest LEGO-only structure out of the "Free-Play Bricks" in under 25 minutes. <p>The structure has to be able to stand by itself for 5 minutes at the end of the building. <p>After the 5 minutes, the last tallest standing structure wins!',
                    'image' => $this->imageUrl . 'SkyScraper-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place'
                    )
                ),
                array(
                    'game' => 'Draft - $15',
                    'description' => 'Each participant pays $15 to divide up $300 worth of LEGO sets. <p>The parts are separated into similar parts then each participant, in order picks an entire pile of similar parts.',
                    'image' => $this->imageUrl . 'Draft_15-t.png',
                    'maxParticipants' => '20',
                    'fee' => 'YES',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES'
                ),
                array(
                    'game' => 'Draft - $25',
                    'description' => 'Each participant pays $25 to divide up $500 worth of LEGO sets. <p>The parts are separated into similar parts then each participant, in order picks an entire pile of similar parts.',
                    'image' => $this->imageUrl . 'Draft_25-t.png',
                    'fee' => 'YES',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES'
                ),
                array(
                    'game' => 'LEGO Poker',
                    'description' => 'Bring your bricks, shades and poker face.<p>This is the traditional Texas-style Hold\'em -- just without the money!',
                    'image' => $this->imageUrl . 'LEGO-Poker-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => 'Build in a Bag',
                    'description' => 'Each participant must build a LEGO set while it is still in the poly-bag. <p>This is an individual game and the first three people to "CORRECTLY" finish the set win.',
                    'image' => $this->imageUrl . 'Build-in-a-Bag-t.png',
                    'maxParticipants' => '10',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => '101 Bricks',
                    'description' => 'Each participant brings 101 of their best LEGO bricks to build four different items pulled randomly selected during the competition. <p>Select your 101 bricks cautiously because the item-to-build might be a castle, alien, women\'s shoe or a horse. A judge will select a winner from each category. <p>The four category winners will compete in the final round.',
                    'image' => $this->imageUrl . '101-Bricks-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => 'Pimp Out Kevin',
                    'description' => 'Bring your favorite accessories to pimp out your Kevin Hinckle mini-fig. <p>Every part in the LEGO universe is available to use during this competition. <p>Rumor has it that Kevin looks best as a blonde in stiletto heels.',
                    'display' => 'NO',
                    'image' => $this->imageUrl . 'Pimp-out-Kevin-t.png',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => 'Cupcake Launch',
                    'description' => 'Build a LEGO Catapult to successfully throw a standard cupcake the farthest distance. <p>No other rules apply other than everything must be LEGO bricks -- expect the cupcake. <p>The cupcake will be provided by BrickSlopes.',
                    'image' => $this->imageUrl . 'Cupcake-Launch-t.png',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => 'Dirty Brickster',
                    'description' => 'Each participant brings an unmarked-brown paper bag full of LEGO bricks. <p>These LEGO bricks can be of any condition, color, size, etc. The only rule is they must be LEGO. <p>The bags are placed in the center of the room on a table. A participant is randomly selected to go first, second and so forth. Each participant may then decide to pick a bag from the table or from someone else with a bag.',
                    'image' => $this->imageUrl . 'Dirty-Brickster-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                ),
                array(
                    'game' => 'Wacky Racers',
                    'description' => 'Each participant builds a non-powered racer to go the farthest distance. <p>The racers are released on a four foot high and eight foot long plank of wood. <p>The racers can not have any external power sources. <p>The wacky racer to go the farthest distance wins.',
                    'image' => $this->imageUrl . 'Wacky-Racers-t.png',
                    'maxParticipants' => '50',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => '2 Team Blind Build',
                    'description' => 'Ten teams of two participants square-off to correctly build a LEGO Set. <p>One team member can only see the bricks. The other team member can only see the instructions. <p>The two individuals must communicate with each other using only words to build the set. <p>The first team to correctly build the set wins.',
                    'image' => $this->imageUrl . 'Team-Blind-Build-t.png',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place'
                    )
                ),
                array(
                    'game' => 'Blind Build',
                    'description' => '20 participants compete to build a set where only the instructions are visible. <p>The builder is separated from the parts and model by a divider. The builder must feel each part to determine correctness and then place it on the model for accurancy. <p>The builder who builds the set the fastest and with the fewest errors wins.',
                    'image' => $this->imageUrl . 'Blind-Build-t.png',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'YES',
                    'awards' => array (
                        'First Place',
                        'Second Place',
                        'Third Place'
                    )
                ),
                array(
                    'game' => 'Speed Build',
                    'description' => 'First person to correctly build a LEGO Set wins.',
                    'image' => $this->imageUrl . 'Speed-Build-t.png',
                    'maxParticipants' => '10',
                    'currentParticipants' => '0',
                    'openRegistration' => 'NO',
                    'awards' => array (
                        'First Place'
                    )
                ),
                array(
                    'game' => 'Team Speed Build',
                    'description' => 'First team to correctly build a LEGO Set wins.',
                    'image' => $this->imageUrl . 'Team-Speed-Build-t.png',
                    'maxParticipants' => '20',
                    'currentParticipants' => '0',
                    'openRegistration' => 'NO',
                    'awards' => array (
                        'First Place'
                    )
                ),
            );

            foreach ($gamesCollection as $gamesMap) {
                $gameMap = array(
                    'game' => $gamesMap['game'],
                    'description' => $gamesMap['description'],
                    'image' => $gamesMap['image'],
                    'display' => (ISSET($gamesMap['display']) ? $gamesMap['display'] : 'YES'),
                    'fee' => (ISSET($gamesMap['fee']) ? $gamesMap['fee'] : 'NO'),
                    'maxParticipants' => $gamesMap['maxParticipants'],
                    'currentParticipants' => $gamesMap['currentParticipants'],
                    'openRegistration' => $gamesMap['openRegistration'],
                    'eventId' => $eventId
                );
                $gameId = $gamesObj->addGameInformation($gameMap);
                $gamesCount++;
                $place = 1;
                if (ISSET($gamesMap['awards'])) {
                    foreach ($gamesMap['awards'] as $gameAward) {
                        $gameAwardMap = array (
                            'award' => $gameAward,
                            'eventId' => $eventId
                        );
                        $gameAwardMap['gameId'] = $gameId;
                        $gameAwardMap['place'] = $place++;
                        $gameAwardsObj->addGameAwardInformation($gameAwardMap);
                        $gameAwardsCount++;
                    }
                }

            }

            $this->validatetable('games', $gamesCount);
            $this->validatetable('gameAwards', $gameAwardsCount);
        }

        private function addInitialEvents() {
            $eventsObj = new events();
            $eventMap = Array();
            $eventMap['name'] = 'BrickSlopes - Salt Lake City';
            $eventMap['city'] = 'Salt Lake City';
            $eventMap['state'] = 'Utah';
            $eventMap['year'] = '2014';
            $eventMap['discountDate'] = '2014-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);
            $this->firstYearEventId = $eventId;

            $this->validateTable('events', 1);

            $eventLineItemsObj = new eventLineItems();
            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 1,
                'lineItem' => '4 Day Event Pass',
                'cost' => '65.00',
                'discount' => '60.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 2,
                'lineItem' => 'T-Shirt',
                'cost' => '20.00',
                'discount' => '15.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 3,
                'lineItem' => 'Meet And Greet',
                'cost' => '15.00',
                'discount' => '10.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 4,
                'lineItem' => 'Complete Name Badge',
                'cost' => '10.00',
                'discount' => '10.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 5,
                'lineItem' => '1st Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 6,
                'lineItem' => '2nd Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 7,
                'lineItem' => 'Event Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 8,
                'lineItem' => 'Draft - $15',
                'cost' => '15.00',
                'discount' => '15.00',
                'linkType' => 'GAME',
                'linkId' => '3',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 9,
                'lineItem' => 'Draft - $25',
                'cost' => '25.00',
                'discount' => '25.00',
                'linkType' => 'GAME',
                'linkId' => '4',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 10,
                'lineItem' => 'Vendor Tables',
                'cost' => '75.00',
                'discount' => '75.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 11,
                'lineItem' => 'Vendor Pass',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

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
            $eventMap['discountDate'] = '2015-03-15 12:00:00';
            $eventId = $eventsObj->addEventInformation($eventMap);
            $this->secondYearEventId = $eventId;

            $this->validateTable('events', 2);

            $eventLineItemsObj = new eventLineItems();
            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 1,
                'lineItem' => '4 Day Event Pass',
                'cost' => '65.00',
                'discount' => '50.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 2,
                'lineItem' => 'T-Shirt',
                'cost' => '20.00',
                'discount' => '15.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 3,
                'lineItem' => 'Meet And Greet',
                'cost' => '15.00',
                'discount' => '10.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 4,
                'lineItem' => 'Complete Name Badge',
                'cost' => '15.00',
                'discount' => '10.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 5,
                'lineItem' => '1st Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 6,
                'lineItem' => '2nd Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 7,
                'lineItem' => 'Event Badge Brick',
                'cost' => '0.00',
                'discount' => '0.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 8,
                'lineItem' => 'Draft - $15',
                'cost' => '15.00',
                'discount' => '15.00',
                'linkType' => 'GAME',
                'linkId' => '3',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 9,
                'lineItem' => 'Draft - $25',
                'cost' => '25.00',
                'discount' => '25.00',
                'linkType' => 'GAME',
                'linkId' => '4',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 10,
                'lineItem' => '1st Vendor Table',
                'cost' => '100.00',
                'discount' => '100.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 11,
                'lineItem' => 'Vendor Pass',
                'cost' => '15.00',
                'discount' => '10.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

            $eventLineItemMap = array (
                'eventId' => $eventId,
                'eventLineItemCodeId' => 12,
                'lineItem' => 'Additional Vendor Tables',
                'cost' => '75.00',
                'discount' => '75.00',
                'linkType' => 'NONE',
                'linkId' => '0',
                'active' => 'YES'
            );
            $eventLineItemsObj->addEventLineItem($eventLineItemMap);

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

            $this->validateTable('eventLineItems', 23);
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
                    } else if ($userMap['email'] == 'emberpilati@gmail.com') {
                        $userMap['password'] = '12345678';
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
                    if (preg_match('/yes/i', $dbObj->flickr)) {
                        $userMap['flickr'] = '';
                    } else {
                        $userMap['flickr'] = $this->trimMigration($dbObj->flickr);
                    }
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
                    $registrationMap['ageVerification'] = $this->formatEnum($dbObj->ageVerification);
                    $registrationMap['comments'] = $dbObj->comments;
                    $registrationMap['amountPaid'] = '55.00';
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
