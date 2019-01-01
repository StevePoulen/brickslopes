<?php
  //require_once('../lib/db.php');

  class starWarsModel extends db {
    function __construct() {
        parent::__construct();
    }

    public function selectAllStarWarsSets($data) {
      $reservedId = $data['filter'] != "" ? $data['filter'] : null;
      return $this->query($this->selectQuery(null, $reservedId));
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

    private function selectQuery($starWarsSetId=null, $reservedId=null) {
      $setWhereStmt = "";
      if ($starWarsSetId) {
        $setWhereStmt = " WHERE starWarsSetsId = '$starWarsSetId'";
      }

      $setWhereFilterStmt = "";
      if ($reservedId) {
        $setWhereFilterStmt = " WHERE reserved = '$reservedId'";
      }

      return "
        SELECT
          sws.starWarsSetsId as id,
          sws.setId as setId,
          sws.description as description,
          sws.genre as genre,
          sws.year as year,
          sws.image as image,
          sws.availability as availability,
          sws.packaging as packaging,
          concat(u.firstName, ' ', SUBString(u.lastName, 0, 1)) as user
        FROM
         starWarsSets sws
            LEFT JOIN starWarsUsersConnector swsuc ON 
              sws.starWarsSetsId = swsuc.starWarsSetsId
                LEFT JOIN users u ON 
                  swsuc.userId = u.userId
        $setWhereStmt
        $setWhereFilterStmt
        ORDER BY
          sws.setId
        ;
      ";
    }
  }
?>
