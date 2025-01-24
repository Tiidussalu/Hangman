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

let word = ''; // The word to guess, initially empty
let guessedWord = ''; // This will store the masked version of the word (underscores instead of letters)

// Function to fetch words from a file (hangman.txt)
async function fetchWords() {
    try {
        const response = await fetch('hangman.txt'); // Adjust the path if needed
        if (!response.ok) {
            throw new Error('Failed to fetch words');
        }
        const text = await response.text();
        const words = text.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length > 0);
        return words;
    } catch (error) {
        console.error('Error fetching words:', error);
        alert('Error loading words from the file. Please try again later.');
    }
}

// Initialize the game
async function initializeGame() {
    // Fetch words from the file
    const words = await fetchWords();
    if (!words || words.length === 0) {
        alert('No words available for the game!');
        return;
    }

    // Select a random word
    word = words[Math.floor(Math.random() * words.length)];

    // Reset the game state
    guessedLetters = [];
    score = 10;
    guessedWord = '';

    // Replace letters with underscores, but keep spaces and special characters unchanged
    for (let char of word) {
        if (char.match(/[a-zõäöüšž]/i)) {
            guessedWord += '_';
        } else {
            guessedWord += char;
        }
    }

    // Update the display
    scoreSpan.innerText = score;
    guessedWordDiv.innerText = guessedWord;
    updateGuessedWord(); // Show underscores initially

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
