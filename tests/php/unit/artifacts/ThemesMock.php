<?php

class ThemesMock extends modelObjects {
    protected $className;

    public function __construct() {
        $this->className = 'themes';
        $this->themeId = $this->themeId();
        $this->eventId = $this->eventId();
        $this->themeAwardId = $this->themeAwardId();
        $this->theme = $this->theme();
        $this->award = $this->award();
        $this->place = $this->place();
    }

    public function getDTO() {
        return array (
            'themeId' => '1',
            'eventId' => '2',
            'theme' => 'Steve Rules',
            'award' => "Helm's Deep",
            'place' => 2
        );
    }

    public function themeId() { return $this->getData(__FUNCTION__); }
    public function eventId() { return $this->getData(__FUNCTION__); }
    public function theme() { return $this->getData(__FUNCTION__); }
    public function themeAwardId() { return $this->getData(__FUNCTION__); }
    public function award() { return $this->getData(__FUNCTION__); }
    public function place() { return $this->getData(__FUNCTION__); }
}
?>
