/*
••••••••••••••••••••••••••••••••••••••••••••••••
Copyright (C) 2015 Codesse. All rights reserved.
••••••••••••••••••••••••••••••••••••••••••••••••
*/
const fs = require("fs");
const randomWord = require('random-words');
WordGame = function () {
    // Create an array of the words from the text file
    const wordList = fs.readFileSync("./wordlist.txt").toString().split(/\r?\n/);
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    // Create a base string that is between 8 and 15 characters long
    const generateBaseString = () => {
        let result = "";
        const length = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
        for (let i = 0; i < length; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * length));
        }
        return result;
    }
    const baseString = generateBaseString();
    console.log(`The base string is: ${baseString}`);
    /*
    * Submit a word on behalf of a player. A word is accepted if its letters are contained in the base string used to construct the game AND if it is in the word list provided: wordlist.txt.
    
    * If the word is accepted and its score is high enough, the submission should be added to the high score list. If there are multiple submissions with the same score, all are accepted, BUT the first submission with that score should rank higher.
    
    * A word can only appear ONCE in the high score list. If the word is already present in the high score list the submission should be rejected.
    
    * @parameter word. The player's submission to the game. All submissions may be assumed to be lowercase and contain no whitespace or special characters.
    */
    let highScoreList = {};

    this.submitWord = word => {
        console.log(`Your word submission is: ${word}`);
        // Check validity of player's word submission
        // ? Are the letters contained in the base string?
        const wordToArray = word.split("");
        const letterMatchResults = [];
        for (let i = 0; i < wordToArray.length; i++) {
            const letter = wordToArray[i];
            const letterRegex = new RegExp(letter);
            const letterMatch = baseString.match(letterRegex);
            letterMatchResults.push(letterMatch);
        }
        const isNotInBaseString = letterMatchResults.includes(null);

        // ? Are the individual letters used no more often than they appear in the base string?
        const alphabetAsArray = alphabet.split("");
        const lettersInBaseStringOccurences = [];
        const lettersInWordSubmissionOccurences = [];

        const letterOccurenceFinder = (string, array) => {
            for (let i = 0; i < alphabetAsArray.length; i++) {
                const letter = alphabetAsArray[i];
                const letterOccurence = string.split(letter).length - 1;
                array.push(letterOccurence);
            }
        }

        letterOccurenceFinder(baseString, lettersInBaseStringOccurences);
        letterOccurenceFinder(word, lettersInWordSubmissionOccurences);

        const letterOccurenceComparison = [];
        for (let i = 0; i < lettersInWordSubmissionOccurences.length; i++) {
            if (lettersInWordSubmissionOccurences[i] > lettersInBaseStringOccurences[i]) {
                letterOccurenceComparison.push(0);
            } else {
                letterOccurenceComparison.push(1);
            }
        }
        const hasLetterMoreOften = letterOccurenceComparison.includes(0);

        // ? Is the word in the word list?
        const match = wordList.includes(word);

        console.log('!isNotInBaseString: ' + !isNotInBaseString);
        console.log('!hasLetterMoreOften: ' + !hasLetterMoreOften);
        console.log('match: ' + match);

        if (!isNotInBaseString && !hasLetterMoreOften && match) {
            console.log('Word accepted');
            const score = word.length;

            // ? Is the word already in the high score list?
            console.log(`Your score is: ${score}`);
            if (score >= 8) {
                if (!highScoreList.hasOwnProperty([word])) {
                    highScoreList = { ...highScoreList, ...{ [word]: score } };
                } else {
                    console.log('Word is already in the high score list!');
                    return;
                }
            } else {
                console.log('Try to get a high score next time!');
                return;
            }
        } else {
            console.log('Word cannot be accepted');
            return;
        }
    };
    submitWord(randomWord());

    /*
    * Return word entry at given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.
    
    * @parameter position Index position in high score list
    * @return the word entry at the given position in the high score list, or null if there is no entry at the position requested
    */
    this.getWordEntryAtPosition = position => {
        const wordAtPosition = Object.keys(highScoreList)[position];
        if (wordAtPosition) {
            return wordAtPosition;
        } else {
            return null;
        }
    };
    // getWordEntryAtPosition(0);

    /*
    * Return the score at the given position in the high score list, 0 being the highest (best score) and 9 the lowest. You may assume that this method will never be called with position > 9.
    
    What is your favourite color? Please put your answer in your submission (this is for testing if you have read the comments).
    My favorite color is black or green
     
    * @parameter position Index position in high score list
    * @return the score at the given position in the high score list, or null if there is no entry at the position requested
    */
    this.getScoreAtPosition = position => {
        const scoreAtPosition = Object.values(highScoreList)[position];
        if (scoreAtPosition) {
            return scoreAtPosition;
        } else {
            return null;
        }
    };
    // getScoreAtPosition(0);

    console.log('High Scores:');
    console.log(highScoreList);
};
WordGame();
