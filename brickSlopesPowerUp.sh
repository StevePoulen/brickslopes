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

pullRepo() {
    printf "\nGit pull output ...\n\n";
    git pull origin $REPOSITORY_BRANCH 
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
    fi
}

userInput() { 
    scriptOutput;
    executionPrompt;
    if [ "$INSTALL_UPGRADE" == "Y" ]; then
        repositoryBranch;
        upgrade;
    else
        printf "\n\nGood-bye\n\n";
    fi
}

#functionTest;
userInput;
