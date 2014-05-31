<?php
//  require_once(__DIR__ . '/../lib/db.php');

class events extends db {
    function __construct() {
        parent::__construct();
    }

    public function addEventInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                events 
            (
                name, 
                city, 
                state,
                year,
                cost,
                discount,
                meetAndGreetCost,
                discountDate
            )
        VALUES
          (
                '{$this->escapeCharacters($data['name'])}',
                '{$this->escapeCharacters($data['city'])}',
                '{$this->escapeCharacters($data['state'])}',
                '{$this->escapeCharacters($data['year'])}',
                '{$this->escapeCharacters($data['cost'])}',
                '{$this->escapeCharacters($data['discount'])}',
                '{$this->escapeCharacters($data['meetAndGreetCost'])}',
                '{$this->escapeCharacters($data['discountDate'])}'
          )
        ;
      ";
    }
}
?>
