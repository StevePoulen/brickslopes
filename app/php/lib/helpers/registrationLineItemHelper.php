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

        public function deleteEventTableLineItems($userId, $eventId) {
            $this->registrationLineItemObj->deleteEventTableLineItems($userId, $eventId);
        }

        public function deleteRegistrationLineItems($userId, $eventId) {
            $this->registrationLineItemObj->deleteRegistrationLineItems($userId, $eventId);
        }

        public function addRegistrationLineItems($data) {
            $data = $this->determineLineItemAmounts($data);
            $this->determineAddEventBrick($data);
            $this->determineEventLineItem($data);
            $this->addMeetAndGreetLineItem($data);
            $this->addTShirtLineItem($data);
            $this->addDraftOneLineItem($data);
            $this->addDraftTwoLineItem($data);
            $this->addBricks($data);
            $this->addVendorLineItem($data);
        }

        private function determineDescription($data) {
            return (ISSET($data['description']) ? $data['description'] : NULL);
        }

        private function determineOwnership($data) {
            return (ISSET($data['isOwner']) ? $data['isOwner'] : 'YES');
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
                $data['firstVendorTableAmount'] = $this->eventLineItemCodes['10009']['discount'];
                $data['eventVendorAmount'] = $this->eventLineItemCodes['10010']['discount'];
                $data['additionalVendorTableAmount'] = $this->eventLineItemCodes['10011']['discount'];
                $data['eventAssociateAmount'] = $this->eventLineItemCodes['10012']['discount'];
                $data['discount'] = 'YES';
            } else {
                $data['eventAmount'] = $this->eventLineItemCodes['10000']['cost'];
                $data['tShirtAmount'] = $this->eventLineItemCodes['10001']['cost'];
                $data['meetAndGreetAmount'] = $this->eventLineItemCodes['10002']['cost'];
                $data['completeNameBadgeAmount'] = $this->eventLineItemCodes['10003']['cost'];
                $data['badgeBrickOneAmount'] = $this->eventLineItemCodes['10004']['cost'];
                $data['badgeBrickTwoAmount'] = $this->eventLineItemCodes['10005']['cost'];
                $data['eventBadgeBrickAmount'] = $this->eventLineItemCodes['10006']['cost'];
                $data['draftOneAmount'] = $this->eventLineItemCodes['10007']['cost'];
                $data['draftTwoAmount'] = $this->eventLineItemCodes['10008']['cost'];
                $data['firstVendorTableAmount'] = $this->eventLineItemCodes['10009']['cost'];
                $data['eventVendorAmount'] = $this->eventLineItemCodes['10010']['cost'];
                $data['additionalVendorTableAmount'] = $this->eventLineItemCodes['10011']['cost'];
                $data['eventAssociateAmount'] = $this->eventLineItemCodes['10012']['cost'];
                $data['discount'] = 'NO';
            }

            $data['eventLineItem'] = $this->eventLineItemCodes['10000']['lineItem'];
            $data['tShirtLineItem'] = $this->eventLineItemCodes['10001']['lineItem'];
            $data['meetAndGreetLineItem'] = $this->eventLineItemCodes['10002']['lineItem'];
            $data['completeNameBadgeLineItem'] = $this->eventLineItemCodes['10003']['lineItem'];
            $data['badgeBrickOneLineItem'] = $this->eventLineItemCodes['10004']['lineItem'];
            $data['badgeBrickTwoLineItem'] = $this->eventLineItemCodes['10005']['lineItem'];
            $data['eventBadgeBrickLineItem'] = $this->eventLineItemCodes['10006']['lineItem'];
            $data['draftOneLineItem'] = $this->eventLineItemCodes['10007']['lineItem'];
            $data['draftTwoLineItem'] = $this->eventLineItemCodes['10008']['lineItem'];
            $data['firstVendorTableLineItem'] = $this->eventLineItemCodes['10009']['lineItem'];
            $data['eventVendorLineItem'] = $this->eventLineItemCodes['10010']['lineItem'];
            $data['additionalVendorTableLineItem'] = $this->eventLineItemCodes['10011']['lineItem'];
            $data['eventAssociateLineItem'] = $this->eventLineItemCodes['10012']['lineItem'];

            if (ISSET($data['nocost']) && $data['nocost']) {
                $data['eventAmount'] = '0.00';
            }

            return $data;
        }

        private function registrarGetsADiscount($discountDate) {
            return strtotime('now') < strtotime($discountDate);
        }

        private function addBrickLineItem($data, $lineItem, $brickType, $code, $amount) {
            $dto = $this->getDTO($data);
            $dto['eventLineItemCodeId'] = $code;
            $dto['amount'] = $amount;
            $dto['discount'] = 'YES';
            $dto['lineItem'] = $lineItem;
            $dto['description'] = $data[$brickType];
            $this->registrationLineItemObj->addRegistrationLineItems($dto);
        }

        private function addBricks($data) {
            try {
                if ($data['nameBadge'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['amount'] = $data['completeNameBadgeAmount'];
                    $dto['eventLineItemCodeId'] = 4;
                    $dto['discount'] = 'YES';
                    $dto['lineItem'] = $data['completeNameBadgeLineItem'];
                    $dto['description'] = $data['badgeLine1'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);

                    $this->addBrickLineItem(
                        $data, 
                        $data['badgeBrickOneLineItem'],
                        'badgeLine2', 
                        5,
                        $data['badgeBrickOneAmount']
                    );
                    $this->addBrickLineItem(
                        $data, 
                        $data['badgeBrickTwoLineItem'],
                        'badgeLine3', 
                        6,
                        $data['badgeBrickTwoAmount']
                    );
                }
            } catch (exception $err) { 
                //Do Nothing
            }
            
            if ($this->addEventBrick) {
                $this->addBrickLineItem(
                    $data, 
                    $data['eventBadgeBrickLineItem'],
                    'badgeLine1', 
                    7,
                    $data['eventBadgeBrickAmount']
                );
            }
        }

        private function determineAddEventBrick($data) {
            if (ISSET($data['associatePass'])) {
                $this->addEventBrick = false;
            } else {
                $this->addEventBrick = true;
            }
        }

        private function determineEventLineItem($data) {
            try {
                if (ISSET($data['vendor']) && $data['vendor'] === 'YES') {
                    $this->addVendorEventLineItem($data);
                } else if (ISSET($data['associatePass']) && $data['associatePass'] === 'YES') {
                    $this->addAssociateEventLineItem($data);
                } else {
                    $this->addEventLineItem($data);
                }
            } catch (exception $err) {
                $this->addEventLineItem($data);
            }
        }

        private function addAssociateEventLineItem($data) {
            try {
                $dto = $this->getDTO($data);
                $dto['eventLineItemCodeId'] = 13;
                $dto['amount'] = $data['eventAssociateAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] =  $data['eventAssociateLineItem'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            } catch (exception $err) { }
        }

        private function addVendorEventLineItem($data) {
            try {
                $dto = $this->getDTO($data);
                $dto['eventLineItemCodeId'] = 11;
                $dto['amount'] = $data['eventVendorAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] =  $data['eventVendorLineItem'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            } catch (exception $err) { }
        }

        private function addEventLineItem($data) {
            try {
                $dto = $this->getDTO($data);
                $dto['eventLineItemCodeId'] = 1;
                $dto['amount'] = $data['eventAmount'];
                $dto['discount'] = $data['discount'];
                $dto['lineItem'] =  $data['eventLineItem'];
                $this->registrationLineItemObj->addRegistrationLineItems($dto);
            } catch (exception $err) { }
        }

        private function addMeetAndGreetLineItem($data) {
            try {
                if ($data['meetAndGreet'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['eventLineItemCodeId'] = 3;
                    $dto['amount'] = $data['meetAndGreetAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] =  $data['meetAndGreetLineItem'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                }
            } catch (exception $err) { }
        }

        private function addTShirtLineItem($data) {
            try {
                if (ISSET($data['tShirtSize']) && $data['tShirtSize'] !== 'No Thanks') {
                    $dto = $this->getDTO($data);
                    $dto['eventLineItemCodeId'] = 2;
                    $dto['amount'] = $data['tShirtAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] =  $data['tShirtLineItem'];
                    $dto['size'] = $data['tShirtSize'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                }
            } catch (exception $err) { }
        }

        public function addVendorLineItemFromTables($data) {
            $data = $this->determineLineItemAmounts($data);
            $this->addVendorLineItem($data);
            $registrationObj = new registrations();
            $registrationObj->updateRegistrationPaidByUserIdAndEventId (
                $data['userId'],
                $data['eventId']
            );
        }

        private function addVendorLineItem($data) {
            try {
                if ($data['vendor'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['eventLineItemCodeId'] = 10;
                    $dto['amount'] = $data['firstVendorTableAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] =  $data['firstVendorTableLineItem'];
                    $dto['quantity'] = 1;
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);

                    if($data['vendorTables'] > 1) {
                        $dto['eventLineItemCodeId'] = 12;
                        $dto['amount'] = $data['additionalVendorTableAmount'];
                        $dto['discount'] = $data['discount'];
                        $dto['lineItem'] =  $data['additionalVendorTableLineItem'];
                        $dto['quantity'] = $data['vendorTables'] - 1;
                        $this->registrationLineItemObj->addRegistrationLineItems($dto);
                    }
                }
            } catch (exception $err) { }
        }

        private function addDraftOneLineItemFromRegistration($data) {
            if ($this->addDraftOneLineItem($data)) {
                $this->addGameUserInformation($data, 3);
            }
        }

        public function addDraftOneLineItemFromGames($data) {
            $data['draftOne'] = 'YES';
            $data = $this->determineLineItemAmounts($data);
            $this->addDraftOneLineItem($data);
        }

        private function addDraftOneLineItem($data) {
            $returnValue = false;
            try {
                if ($data['draftOne'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['eventLineItemCodeId'] = 8;
                    $dto['amount'] = $data['draftOneAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = $data['draftOneLineItem'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                    $returnValue = true;
                }
            } catch (exception $err) { }

            return $returnValue;
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

        private function addDraftTwoLineItemFromRegistration($data) {
            if ($this->addDraftTwoLineItem($data)) {
                $this->addGameUserInformation($data, 4);
            }
        }

        public function addDraftTwoLineItemFromGames($data) {
            $data['draftTwo'] = 'YES';
            $data = $this->determineLineItemAmounts($data);
            $this->addDraftTwoLineItem($data);
        }

        private function addDraftTwoLineItem($data) {
            $returnValue = false;
            try {
                if ($data['draftTwo'] === 'YES') {
                    $dto = $this->getDTO($data);
                    $dto['eventLineItemCodeId'] = 9;
                    $dto['amount'] = $data['draftTwoAmount'];
                    $dto['discount'] = $data['discount'];
                    $dto['lineItem'] = $data['draftTwoLineItem'];
                    $this->registrationLineItemObj->addRegistrationLineItems($dto);
                    $returnValue = true;
                }
            } catch (exception $err) { }
            return $returnValue;
        }

        private function getDTO($data) {
            return array (
                'eventId' => $data['eventId'], 
                'userId' => $data['userId'], 
                'lineItem' => null,
                'amount' => null,
                'paid' => 'NO',
                'discount' => null,
                'description' => $this->determineDescription($data),
                'size' => null,
                'quantity' => 1,
                'active' => 'YES',
                'isOwner' => $this->determineOwnership($data)
            );
        }
    }
?>
