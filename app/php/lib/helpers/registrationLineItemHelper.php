<?php
    class registrationLineItemHelper {
        private $registrationLineItemObj;
        private $eventLineItemCodes = array();

        public function __construct($eventId) {
            $this->registrationLineItemObj = new registrationLineItemModel();
            $this->buildEventLineItemCodes($eventId);
        }

        private function buildEventLineItemCodes($eventId) {
            $eventLineItemsObj = new eventLineItems();
            $eventLineItemsObj->getEventLineItems($eventId);
            while($dbObj = $eventLineItemsObj->result->fetch_object()) {
                $this->eventLineItemCodes[$dbObj->code] = array (
                    'lineItem' => $dbObj->lineItem, 
                    'code' => $dbObj->code, 
                    'cost' => $dbObj->cost, 
                    'discount' => $dbObj->discount
                );
            }
        }

        public function deleteRegistrationLineItems($userId, $eventId) {
            $this->registrationLineItemObj->deleteRegistrationLineItems($userId, $eventId);
        }

        public function addRegistrationLineItems($data) {
            $data = $this->determineLineItemAmounts($data);
            $this->addEventLineItem($data);
            $this->addMeetAndGreetLineItem($data);
            $this->addTShirtLineItem($data);
            $this->addDraftOneLineItem($data);
            $this->addDraftTwoLineItem($data);
            $this->addBricks($data);
        }

        private function determineLineItemAmounts($data) {
            if ($this->registrarGetsADiscount($data['discountDate'])) {
                $data['eventAmount'] = $this->eventLineItemCodes['10000']['discount'];
                $data['tShirtAmount'] = $this->eventLineItemCodes['10001']['discount'];
                $data['meetAndGreetAmount'] = $this->eventLineItemCodes['10002']['discount'];
                $data['completeNameBadgeAmount'] = $this->eventLineItemCodes['10003']['discount'];
                $data['badgeBrickOneAmount'] = $this->eventLineItemCodes['10004']['discount'];
                $data['badgeBrickTwoAmount'] = $this->eventLineItemCodes['10005']['discount'];
                $data['eventBadgeBrickAmount'] = $this->eventLineItemCodes['10006']['discount'];
                $data['draftOneAmount'] = $this->eventLineItemCodes['10007']['discount'];
                $data['draftTwoAmount'] = $this->eventLineItemCodes['10008']['discount'];
                $data['discount'] = 'YES';
            } else {
                $data['eventAmount'] = $this->eventLineItemCodes['10000']['cost'];
                $data['tShirtAmount'] = $this->eventLineItemCodes['10001']['cost'];
                $data['meetAndGreetAmount'] = $this->eventLineItemCodes['10001']['cost'];
                $data['completeNameBadgeAmount'] = $this->eventLineItemCodes['10003']['cost'];
                $data['badgeBrickOneAmount'] = $this->eventLineItemCodes['10004']['cost'];
                $data['badgeBrickTwoAmount'] = $this->eventLineItemCodes['10005']['cost'];
                $data['eventBadgeBrickAmount'] = $this->eventLineItemCodes['10006']['cost'];
                $data['draftOneAmount'] = $this->eventLineItemCodes['10007']['cost'];
                $data['draftTwoAmount'] = $this->eventLineItemCodes['10008']['cost'];
                $data['discount'] = 'NO';
            }

            $data['draftOneLineItem'] = $this->eventLineItemCodes['10007']['lineItem'];
            $data['draftTwoLineItem'] = $this->eventLineItemCodes['10008']['lineItem'];

            return $data;
        }

        private function registrarGetsADiscount($discountDate) {
            return strtotime('now') < strtotime($discountDate);
        }

        private function addBrickLineItem($data, $lineItem, $brickType, $code) {
            $dto = $this->getDTO($data);
            $dto['code'] = $code;
            $dto['amount'] = $this->eventLineItemCodes[$code]['cost'];
            $dto['discount'] = 'YES';
            $dto['lineItem'] = $lineItem;
            $dto['description'] = $data[$brickType];
            $this->registrationLineItemObj->addRegistrationLineItems($dto);
        }

        private function addBricks($data) {
            if ($data['nameBadge'] === 'YES') {
                $dto = $this->getDTO($data);
                $dto['amount'] = $this->eventLineItemCodes['10003']['cost'];
                $dto['code'] = '10003';
                $dto['discount'] = 'YES';
                $dto['lineItem'] = 'Complete Name Badge';
                $dto['description'] = $data['badgeLine1'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);

                $this->addBrickLineItem($data, '1st Badge Brick', 'badgeLine2', 10004);
                $this->addBrickLineItem($data, '2nd Badge Brick', 'badgeLine3', 10005);
            }
            $this->addBrickLineItem($data, 'Event Badge Brick', 'badgeLine1', 10006);
        }

        private function addEventLineItem($data) {
            try {
                $dto = $this->getDTO($data);
                $dto['code'] = '10000';
                $dto['amount'] = $data['eventAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] = 'Event Pass';
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            } catch (exception $err) { }
        }

        private function addMeetAndGreetLineItem($data) {
            try {
                if ($data['meetAndGreet'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['code'] = '10002';
                    $dto['amount'] = $data['meetAndGreetAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = 'Meet and Greet';
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                }
            } catch (exception $err) { }
        }

        private function addTShirtLineItem($data) {
            try {
                if ($data['tShirtSize'] !== 'No Thanks') {
                    $dto = $this->getDTO($data);
                    $dto['code'] = '10001';
                    $dto['amount'] = $data['tShirtAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = 'T-Shirt';
                    $dto['size'] = $data['tShirtSize'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                }
            } catch (exception $err) { }
        }

        private function addDraftOneLineItem($data) {
            try {
                if ($data['draftOne'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['code'] = '10007';
                    $dto['amount'] = $data['draftOneAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = $data['draftOneLineItem'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                    $this->addGameUserInformation($data, 3);
                }
            } catch (exception $err) { }
        }

        private function addGameUserInformation($data, $gameId) {
            $gameData = array (
                'gameId' => $gameId,
                'userId' => $data['userId'],
                'eventId' => $data['eventId'],
                'type' => 'PARTICIPANT',

            );
            $gameUserObj = new gameUserModel();
            $gameUserObj->addGameUserInformation($gameData);
        }

        private function addDraftTwoLineItem($data) {
            try {
                if ($data['draftTwo'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['code'] = '10008';
                    $dto['amount'] = $data['draftTwoAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = $data['draftTwoLineItem'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                    $this->addGameUserInformation($data, 4);
                }
            } catch (exception $err) { }
        }

        private function getDTO($data) {
            return array (
                'eventId' => $data['eventId'], 
                'userId' => $data['userId'], 
                'lineItem' => null,
                'amount' => null,
                'paid' => 'NO',
                'discount' => null,
                'description' => null,
                'size' => null,
                'quantity' => 1,
                'active' => 'YES'
            );
        }

    }
?>
