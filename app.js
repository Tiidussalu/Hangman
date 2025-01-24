// Select important HTML elements
const scoreSpan = document.getElementById('score'); // The score display element (shows lives)
const guessedWordDiv = document.getElementById('word'); // The element where the hidden word is displayed
const alphabetDiv = document.getElementById('alphabet'); // The element where the clickable alphabet letters will be added
const resetButton = document.getElementById('resetButton'); // The reset button

// Define the alphabet used in the game, including Estonian letters
const alphabet = 'abdefghijklmnoprsšzžtuvõäöü';

// Store letters that the player has guessed
let guessedLetters = [];

// Set the initial score (lives)
let score = 10;

// Define the word to guess (converted to lowercase for case-insensitivity)
let word = 'Kuressaare Ametikool'.toLowerCase();
let guessedWord = ''; // This will store the masked version of the word (underscores instead of letters)

// Initialize the game
function initializeGame() {
    guessedLetters = []; // Clear previously guessed letters
    score = 10; // Reset score
    word = 'Kuressaare Ametikool'.toLowerCase(); // Reset word
    guessedWord = ''; // Reset guessedWord

    // Replace letters with underscores, but keep spaces and special characters unchanged
    for (let char of word) {
        if (char.match(/[a-zõäöüšž]/i)) { // If the character is a letter, replace it with "_"
            guessedWord += '_';
        } else { // If it's a space or special character, keep it as is
            guessedWord += char;
        }
    }

    scoreSpan.innerText = score; // Update the score display
    guessedWordDiv.innerText = guessedWord; // Update the word display
    updateGuessedWord(); // Update word display to show underscores initially

    // Clear any previous buttons and create new ones
    alphabetDiv.innerHTML = '';
    for (let letter of alphabet) {
        const letterSpan = document.createElement('span');
        letterSpan.id = letter;
        letterSpan.innerText = letter.toUpperCase();

        // Add a click event listener to each letter
        letterSpan.addEventListener('click', () => {
            if (!guessedLetters.includes(letter)) { // Check if the letter has already been guessed
                guessedLetters.push(letter); // Add the letter to guessedLetters array

                if (word.includes(letter)) { // If the word contains the letter
                    letterSpan.classList.add('correct'); // Mark the letter as correct (green color)
                    updateGuessedWord(); // Update the displayed word
                } else { // If the letter is NOT in the word
                    score--; // Decrease the score (lose a life)
                    scoreSpan.innerText = score; // Update the score display
                    letterSpan.classList.add('uncorrect'); // Mark the letter as incorrect (red color)

                    // If the player runs out of lives, show an alert and restart the game
                    if (score <= 0) {
                        alert('Mäng läbi, õige sõna: ' + word); // Show the correct word
                        initializeGame(); // Reset the game
                    }
                }
            }
        });

        alphabetDiv.appendChild(letterSpan); // Add the letter button to the alphabet container
    }
}

// Function to update the displayed word when the player guesses a correct letter
function updateGuessedWord() {
    let displayWord = ''; // Temporary variable to build the updated word
    let isComplete = true; // Flag to check if the word is fully guessed

    for (let i = 0; i < word.length; i++) {
        if (guessedLetters.includes(word[i])) { // If the letter has been guessed, show it
            displayWord += word[i];
        } else { // Otherwise, keep the underscore
            displayWord += guessedWord[i];
            if (word[i].match(/[a-zõäöüšž]/i)) { 
                isComplete = false; // If any letter is missing, set flag to false
            }
        }
    }

    guessedWordDiv.innerText = displayWord; // Update the displayed word

    if (isComplete) { // If all letters are revealed, the player wins
        setTimeout(() => alert('Palju õnne! Sa arvasid sõna õieti!'), 300);
    }
}

// Initialize the game when the page loads
initializeGame();

// Add an event listener for the reset button to reset the game
resetButton.addEventListener('click', initializeGame);
