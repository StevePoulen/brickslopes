#!/bin/bash

STEP_COUNTER=1;

incStep() {
    ((STEP_COUNTER++))
}

executionPrompt() {
    printf "\nSTEP $STEP_COUNTER: You are about to install new upgrades for BrickSlopes.com\n";
    printf "This will stash all current changes and pull new code from the repository.\n";
    echo -n "Are you sure? (Y\n) [ENTER]: "; 
    read INSTALL_UPGRADE;
    incStep
}

deletePrompt() {
    printf "\nSTEP $STEP_COUNTER: Do you want to drop the n-1 stash?\n";
    echo -n "Are you sure? (Y\n) [ENTER]: "; 
    read DROP_STASH;
    incStep
}

repositoryBranch() {
    printf "\nSTEP $STEP_COUNTER: Which repository branch do you want to use to upgrade BrickSlopes.com?\n";
    echo -n "Branch Name? (The 'master' branch is the default) [ENTER]: "; 
    read REPOSITORY_BRANCH;
    if [ ! -n "$REPOSITORY_BRANCH" ]; then
        REPOSITORY_BRANCH=master;
    fi
    incStep
}

scriptOutput() {
    clear;
    printf "\n***********************************************";
    printf "\n* BrickSlopes Website Upgrade*";
    printf "\n***********************************************";
    printf "\n\n";
}

stashRepo() {
    printf "\nGit stash output ...\n\n";
    git stash
    printf "\n\n";
}

dropStash() {
    printf "\nGit stash drop ...\n\n";
    git stash drop stash@{2}
    git stash list
    printf "\n\n";
}

pullRepo() {
    printf "\nGit pull output ...\n\n";
    git pull origin $REPOSITORY_BRANCH 
    printf "\n\n";
}

mysqlRootPassword() {
    printf "\nSTEP $STEP_COUNTER: What is your 'MYSQL' root user password?\n";
    read -p "Password:" -s MYSQL_ROOT_PASSWORD;
    printf "\n";
}

setCronProcess() {
    printf "\nUpdating the cronprocess ...\n\n";
    `perl -i -pe s/mysql_password/${MYSQL_ROOT_PASSWORD}/g ./config/cronfile`
    crontab /home/stepou4/brickslopes.com/config/cronfile
    crontab -l
    printf "\n\n";
}

regexHtaccess() {
    printf "\nUpdating the app/.htaccess file ...\n\n";
    perl -i -pe 's/mybrickslopes\.com/brickslopes.com/g' ./app/.htaccess
    printf "\n\n";
}

removeTestIds() {
    printf "\nRemoving the t_* testing ids ...\n\n";
    find ./app/partials -name \*\.html -exec perl -i -pe 's/id="t_.*?"\s//g' {} \;
    printf "\n\n";
}

cssGeneration() {
    printf "\nUpdating the css files ...\n\n";
    compass clean
    compass compile ./
    printf "\n\n";
}


upgrade() {
    printf "\n\nUpgrading\n\n";
    if [[ "$INSTALL_UPGRADE" == "Y" ]]
    then
        stashRepo;
        pullRepo;
        regexHtaccess;
        removeTestIds;
        cssGeneration;
        setCronProcess;
        if [ "$DROP_STASH" == "Y" ]; then
            dropStash;
        fi
    fi
}

userInput() { 
    scriptOutput;
    executionPrompt;
    if [ "$INSTALL_UPGRADE" == "Y" ]; then
        deletePrompt;
        repositoryBranch;
        mysqlRootPassword;
        upgrade;
    else
        printf "\n\nGood-bye\n\n";
    fi
}

#functionTest;
userInput;
