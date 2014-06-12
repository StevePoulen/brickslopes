<?php

class ThemesMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->className = 'themes';
        $this->eventId = $this->eventId();
        $this->theme = $this->theme();
    }

    public function getDTO() {
        return array (
            'eventId' => '2',
            'theme' => 'Steve Rules'
        );
    }

    public function eventId() { return $this->getData(__FUNCTION__); }
    public function theme() { return $this->getData(__FUNCTION__); }
}
?>
