<?php

class FeedbackModel extends db {
    protected $dbResult;
    function __construct() {
        $this->dbResult = new FeedbackMock();
        parent::__construct();
    }

    public function addFeedbackInformation($data) {
        return $this->query();
    }

    public function getFeedbackInformation() {
        return $this->query();
    }
}

class FeedbackMock extends modelObjects {
    protected $dataSet;

    public function __construct() {
        parent::__construct('feedbackDB.txt');
    }

    public function feedbackId() { return $this->getData(0); }
    public function userId() { return $this->getData(1); }
    public function email() { return $this->getData(2); }
    public function feedback() { return $this->getData(3); }
    public function posted() { return $this->getData(4); }
}
?>
