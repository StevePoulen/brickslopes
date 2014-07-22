#!/bin/bash

PASSWORD="--password=";
ROOT_DATABASE="mysql";
BRICKSLOPES_DATABASE="brickslopes";
STEP_COUNTER=1;

incStep() {
    ((STEP_COUNTER++))
}

#Insert New Tables
executeDBStatement() {
    DB_FILE="./dbScripts/$1";
    echo "Executing: $DB_FILE";
    if [[ "$LOCAL_DB" == "Y" ]]
    then
        mysql -u root $BRICKSLOPES_DATABASE $PASSWORD$MYSQL_ROOT_PASSWORD < $DB_FILE
    else
        mysql -u 7hiez8ei $BRICKSLOPES_DATABASE -h mysql.brickslopes.com $PASSWORD$MYSQL_ROOT_PASSWORD < $DB_FILE
    fi
}

cleanInstallation() {
    printf "\nSTEP $STEP_COUNTER: Is this a clean database installation?\n";
    echo -n "Clean DB Installation? (Y\n) [ENTER]: "; 
    read CLEAN_DB_INSTALLATION;
    incStep
}

archiveDatabase() {
    printf "\nSTEP $STEP_COUNTER: Do you want to archive the 'BrickSlopes' database?\n";
    echo -n "Archive DB? (Y\n) [ENTER]: "; 
    read ARCHIVE_DB;
    incStep
}

brickSlopesEnvironment() {
    printf "\nSTEP $STEP_COUNTER: Is this a local 'BrickSlopes' database?\n";
    echo -n "Local DB? (Y\n) [ENTER]: "; 
    read LOCAL_DB;
    incStep
}

brickSlopesDBCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' database?\n";
    echo "* WARNING * This is delete the current database";
    echo -n "Create DB? (Y\n) [ENTER]: "; 
    read CREATE_DB;
    incStep
}

adminDBCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' admin user?\n";
    echo "* WARNING * This is add a 'brickSlopes' user to the mysql user table";
    echo -n "Create Admin user? (Y\n) [ENTER]: ";
    read CREATE_ADMIN;
    incStep
}

dropTables() {
    printf "\nSTEP $STEP_COUNTER: Drop all the 'BrickSlopes' tables?\n";
    echo "* WARNING * This is will delete all of the data";
    echo -n "Drop all tables? (Y\n) [ENTER]: ";
    read DROP_ALL_TABLES;
    incStep
}

isDropAllTables() {
    if [[ "$DROP_ALL_TABLES" == "Y" ]]
    then
        return true;
    else
        return false;
    fi
}

mysqlRootPassword() {
    printf "\nSTEP $STEP_COUNTER: What is your 'MYSQL' root user password?\n";
    echo "* INFO * All SQL statements are executed as the 'MYSQL root' user";
    read -p "Password:" -s MYSQL_ROOT_PASSWORD;
    printf "\n";
    incStep
}

adminPassword() {
    if [[ "$CREATE_ADMIN" == "Y" ]]
    then
        printf "\nSTEP $STEP_COUNTER: Set the 'BrickSlopes' admin user password.\n";
        read -p "Password:" -s ADMIN_PASSWORD;
        echo ""
        read -p "Confirm password?:" -s CONFIRM_ADMIN_PASSWORD;
        if [[ "$ADMIN_PASSWORD" != "$CONFIRM_ADMIN_PASSWORD" ]]
        then
            adminPassword
        else
            incStep
        fi
    fi
}

registrationLineItemTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' registration line item table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_REGISTRATION_LINE_ITEM_TABLE;
    incStep
}

mocTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' moc table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_MOC_TABLE;
    incStep
}

feedbackTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' feedback table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_FEEDBACK_TABLE;
    incStep
}

themeTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' theme table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_THEME_TABLE;
    incStep
}

eventTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' event table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_EVENT_TABLE;
    incStep
}

eventDatesTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' eventDates table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_EVENT_DATES_TABLE;
    incStep
}

userTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' user table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_USER_TABLE;
    incStep
}

registrationTableCreation() {
    printf "\nSTEP $STEP_COUNTER: Create the 'BrickSlopes' registration table?\n";
    echo "* WARNING * This is delete the current table";
    echo -n "Create table? (Y\n) [ENTER]: "; 
    read CREATE_REGISTRATION_TABLE;
    incStep
}


userInput() { 
    clear;
    printf "\n***********************************************";
    printf "\n* BrickSlopes Database Installation           *";
    printf "\n***********************************************";
    printf "\n\n";
    echo "This script will install the 'BrickSlopes' database.";
    printf "\n";
    archiveDatabase;
    cleanInstallation;
    brickSlopesEnvironment;
    mysqlRootPassword;
    runArchiveDatabaseScript
    if [[ "$CLEAN_DB_INSTALLATION" == "Y" ]]
    then
        brickSlopesDBCreation;
        adminDBCreation;
        adminPassword;
    fi
    dropTables;
    if [[ "$DROP_ALL_TABLES" != "Y" ]]
    then
        eventTableCreation;
        eventDatesTableCreation;
        userTableCreation;
        registrationTableCreation;
        registrationLineItemTableCreation;
        themeTableCreation;
        mocTableCreation;
        feedbackTableCreation;
    fi
}

runArchiveDatabaseScript() {
    if [[ "$ARCHIVE_DB" == "Y" ]]
    then
        ./backups/backup_db_script.sh -i Y -p $MYSQL_ROOT_PASSWORD  -d $LOCAL_DB
    fi
}

createDatabase() {
    if [[ "$CREATE_DB" == "Y" ]]
    then
        echo "Create Database";
    fi
}

setAdminPassword() {
    echo "Set ADMIN Password";
}

createAdmin() {
    if [[ "$CREATE_ADMIN" == "Y" ]]
    then
        echo "Create ADMIN";
        setAdminPassword;
    fi
}

createRegistrationLineItemTable() {
    if [[ "$CREATE_REGISTRATION_LINE_ITEM_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "08_dbCreateRegistrationLineItemsTable.txt"
    fi
}

createFeedbackTable() {
    if [[ "$CREATE_FEEDBACK_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "10_dbCreateFeedbackTable.txt"
    fi
}

createMocTable() {
    if [[ "$CREATE_MOC_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "09_dbCreateMocTable.txt"
    fi
}

createThemesTable() {
    if [[ "$CREATE_THEME_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "07_dbCreateThemeTable.txt"
    fi
}

createEventTable() {
    if [[ "$CREATE_EVENT_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "03_dbCreateEventTable.txt"
    fi
}

dropAllTables() {
    if [[ "$DROP_ALL_TABLES" == "Y" ]]
    then
        executeDBStatement "00_dbDropAllTables.txt"
    fi
}

createEventDatesTable() {
    if [[ "$CREATE_EVENT_DATES_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "06_dbCreateEventDatesTable.txt"
    fi
}

createUserTable() {
    if [[ "$CREATE_USER_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "04_dbCreateUsersTable.txt"
    fi
}

createRegistrationTable() {
    if [[ "$CREATE_REGISTRATION_TABLE" == "Y" || isDropAllTables ]]
    then
        executeDBStatement "05_dbCreateRegistrationsTable.txt"
    fi
}

functionTest() {
    for i in {1..10}; 
    do 
        echo -en "\r$i"; 
        sleep 0.25
    done
}

#functionTest;
userInput;
printf "\n\nWorking\n\n";
createDatabase;
createAdmin;
dropAllTables;
createEventTable;
createEventDatesTable;
createUserTable;
createRegistrationTable;
createThemesTable;
createRegistrationLineItemTable;
createMocTable;
createFeedbackTable;
