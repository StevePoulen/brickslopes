#!/bin/bash

OUTPUT_FILE_NAME="brickSlopes_Backup.bz2"
STEP_COUNTER=1;
BRICKSLOPES_DATABASE="brickslopes";

incStep() {
    ((STEP_COUNTER++))
}

mysqlRootPassword() {
    printf "\nSTEP $STEP_COUNTER: What is your 'MYSQL' root user password?\n";
    echo "* INFO * All SQL statements are executed as the 'MYSQL root' user";
    read -p "Password:" -s MYSQL_ROOT_PASSWORD;
    printf "\n";
    incStep
}

localDevelopment() {
    /opt/local/bin/mysqldump5 --add-drop-table --routines -u root --password=$MYSQL_ROOT_PASSWORD $BRICKSLOPES_DATABASE | /opt/local/bin/bzip2 -c > $OUTPUT_FILE_NAME
}

liveServer() {
    /usr/bin/mysqldump --add-drop-table --routines -u 7hiez8ei --password=$MYSQL_ROOT_PASSWORD $BRICKSLOPES_DATABASE -h mysql.brickslopes.com | /bin/bzip2 -c > $OUTPUT_FILE_NAME
}

brickSlopesEnvironment() {
    printf "\nSTEP $STEP_COUNTER: Is this a local 'BrickSlopes' database?\n";
    echo -n "Local DB? (Y\n) [ENTER]: "; 
    read LOCAL_DB;
    incStep
}

executeBackup() {
    echo "Backing up: $OUTPUT_FILE_NAME"
    if [[ "$LOCAL_DB" == "Y" ]]
    then
        localDevelopment
    else
        liveServer 
    fi
}

userInput() {
    clear;
    printf "\n***********************************************";
    printf "\n* BrickSlopes Database Backup                 *";
    printf "\n***********************************************";
    printf "\n\n";
    echo "This script will backup the 'BrickSlopes' database.";
    printf "\n";
    brickSlopesEnvironment;
    mysqlRootPassword;
    executeBackup;
}
userInput;
