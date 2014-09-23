<?php

    include_once join('/', array(__DIR__, '..', '..', 'app','php', 'AutoLoader.php'));
    require_once join('/', array(__DIR__, '..', '..', 'config', 'config.php'));

    class updateDatabase {
        private $validObj;

        public function __construct() {
            $this->validObj = new db();
            $this->prompt();
        }

        private function prompt() {
            echo "Are you sure you want to update the vendor pass line items?\n";
            echo "Type 'yes' to continue: ";
            $handle = fopen ("php://stdin","r");
            $line = fgets($handle);
            if(trim($line) != 'yes'){
                echo "ABORTING!\n";
                exit;
            }

            $this->runMigrations();
        }

        private function runMigrations() {
            $this->addEventLineItemCode();
            $this->addEventLineItem();
            $this->updateTableCost();
            $this->updateVendorPass();
            echo "\n\nSuccess!\n\n";
        }

        private function addEventLineItemCode() {
            $this->validObj->query("INSERT INTO eventLineItemCodes (code, lineItem) VALUES ('10012', 'Associate Pass');");
            if ($this->validObj->query("select * from eventLineItemCodes where code = '10012';") != 1) {
                echo "ABORTING! Event Line Item Code not added\n";
                exit;
            };
        }

        private function updateVendorPass() {
            $this->validObj->query("UPDATE eventLineItems set cost = '0.00', discount = '0.00' where eventLineItemCodeId = 11;");
            $this->validObj->query("select * from eventLineItems where eventLineItemCodeId = 11 and eventId = 2;");
            if ($this->validObj->result) {
                while($dbObj = $this->validObj->result->fetch_object()) {
                    $this->validateQuery(11, $dbObj->eventLineItemCodeId);
                    $this->validateQuery('Vendor Pass', $dbObj->lineItem);
                    $this->validateQuery('0.00', $dbObj->cost);
                    $this->validateQuery('0.00', $dbObj->discount);
                    $this->validateQuery('YES', $dbObj->active);
                }
            } else {
                echo "ABORTING!\n";
                echo $this->validObj->getError();
                echo "\n";
                exit;
            }
        }

        private function updateTableCost() {
            $this->validObj->query("UPDATE eventLineItems set cost = '150.00', discount = '150.00' where eventLineItemCodeId = 10;");
            $this->validObj->query("select * from eventLineItems where eventLineItemCodeId = 10 and eventId = 2;");
            if ($this->validObj->result) {
                while($dbObj = $this->validObj->result->fetch_object()) {
                    $this->validateQuery(10, $dbObj->eventLineItemCodeId);
                    $this->validateQuery('1st Vendor Table', $dbObj->lineItem);
                    $this->validateQuery('150.00', $dbObj->cost);
                    $this->validateQuery('150.00', $dbObj->discount);
                    $this->validateQuery('YES', $dbObj->active);
                }
            } else {
                echo "ABORTING!\n";
                echo $this->validObj->getError();
                echo "\n";
                exit;
            }
        }

        private function addEventLineItem() {
            $this->validObj->query("INSERT INTO eventLineItems (eventId, eventLineItemCodeId, lineItem, cost, discount, linkType, linkId, active) values (2, 13, 'Associate Pass', '15.00', '10.00', 'NONE', 0, 'YES');");
            $this->validObj->query("select * from eventLineItems where eventLineItemCodeId = 13 and eventId = 2;");
            if ($this->validObj->result) {
                while($dbObj = $this->validObj->result->fetch_object()) {
                    $this->validateQuery(13, $dbObj->eventLineItemCodeId);
                    $this->validateQuery('Associate Pass', $dbObj->lineItem);
                    $this->validateQuery('15.00', $dbObj->cost);
                    $this->validateQuery('10.00', $dbObj->discount);
                    $this->validateQuery('NONE', $dbObj->linkType);
                    $this->validateQuery('0', $dbObj->linkId);
                    $this->validateQuery('YES', $dbObj->active);
                }
            } else {
                echo "ABORTING!\n";
                echo $this->validObj->getError();
                echo "\n";
                exit;
            }
        }
    
        private function validateQuery($expected, $actual) {
            if ($expected != $actual) {
                echo "ABORTING! $expected != $actual\n";
                exit;
            };
        }
    }

    new updateDatabase();
?>
