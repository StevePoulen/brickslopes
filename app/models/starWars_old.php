<?php
  require_once('../lib/db.php');

  class StarWars extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllStarWarsSets() {
       return $this->query($this->selectQuery());
    }

    public function selectStarWarsSetById($starWarsSetId) {
       return $this->query($this->selectQuery($starWarsSetId));
    }

    public function getReservedStarWarsSetsCount() {
      return $this->query($this->getStarWarsSetsCountQuery(" reserved != '' "));
    }

    public function getAvailableStarWarsSetsCount() {
      return $this->query($this->getStarWarsSetsCountQuery(" reserved = '' "));
    }

    public function setReservedStarWarsSetByEmail($starWarsSetId, $emailAddress) {
      return $this->query($this->setStarWarsSetsReserveEmailQuery($starWarsSetId, $emailAddress));
    }

    private function setStarWarsSetsReserveEmailQuery($starWarsSetId, $emailAddress) {
      return "
        UPDATE
         starWarsSets
        SET
          reserved = '$emailAddress'
        WHERE
          starWarsSetsId = $starWarsSetId
        ;
      ";
    }

    private function getStarWarsSetsCountQuery($reservedWhereStmt) {
      return "
        SELECT
          count(setId)
        FROM
         starWarsSets
        WHERE
          $reservedWhereStmt
        GROUP BY
          setId
        ;
      ";
    }

    private function selectQuery($starWarsSetId=null) {
      $setWhereStmt = "";
      if ($starWarsSetId) {
        $setWhereStmt = " WHERE starWarsSetsId = '$starWarsSetId'";
      }

      return "
        SELECT
          starWarsSetsId,
          setId,
          description,
          genre,
          year,
          image,
          reserved 
        FROM
         starWarsSets
        $setWhereStmt
        ORDER BY
          setId
        ;
      ";
    }
  }
?>
