<?php

class themeAwards extends db {
    function __construct() {
        parent::__construct();
    }

    public function addThemeAwardInformation($data) {
        return $this->query($this->insertQuery($data));
    }

    private function insertQuery($data) {
        return "
            INSERT INTO
                themeAwards 
            (
                themeId, 
                award,
                place
            )
        VALUES
          (
                '{$this->escapeCharacters($data['themeId'])}',
                '{$this->escapeCharacters($data['award'])}',
                '{$this->escapeCharacters($data['place'])}'
          )
        ;
      ";
    }
}
?>
