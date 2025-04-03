const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Path to the JSON file (adjust this based on your server directory structure)
const jsonFilePath = path.join(__dirname, 'public', 'jp', 'words.json');

// Read the current JSON data from the file
function readJSONFile() {
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(rawData);
}

// Write updated JSON data to the file
function writeJSONFile(data) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// Function to generate the next available ID by checking the current highest ID
function generateNextId(jsonData) {
    const ids = Object.values(jsonData).map(entry => entry.id);
    const highestId = ids.length > 0 ? Math.max(...ids) : 0;
    return highestId + 1;
}

// Function to add a new entry to the JSON data
function addNewEntry(rl) {
    rl.question("Enter the new word in Japanese: ", (word) => {
        rl.question(`Enter the meanings for '${word}' (comma separated): `, (meaning) => {
            rl.question(`Enter the usage for '${word}': `, (usage) => {
                rl.question(`Enter example sentences for '${word}' (comma separated): `, (examples) => {
                    rl.question(`Enter image URLs for '${word}' (comma separated): `, (images) => {

                        const jsonData = readJSONFile();

                        // Automatically generate the next ID
                        const id = generateNextId(jsonData);

                        const newData = {
                            [word]: {
                                "id": id,
                                "meaning": meaning.split(',').map(m => m.trim()),
                                "usage": usage.trim(),
                                "examples": examples.split(',').map(e => e.trim()),
                                "images": images.split(',').map(i => i.trim())
                            }
                        };

                        // Add new entry to the existing JSON data
                        const updatedData = { ...jsonData, ...newData };

                        // Save the updated data back to the file
                        writeJSONFile(updatedData);
                        console.log("New entry added and file updated!");

                        // Continue to add another entry or exit
                        rl.question('Do you want to add another entry? (yes/no): ', (answer) => {
                            if (answer.toLowerCase() === 'yes') {
                                addNewEntry(rl);
                            } else {
                                console.log("Exiting...");
                                rl.close();
                            }
                        });
                    });
                });
            });
        });
    });
}

// Main loop to ask user how many entries they want to add
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main function to interact with the user
function start() {
    rl.question('How many entries do you want to add? (Type "exit" to quit): ', (numEntries) => {
        if (numEntries.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        if (isNaN(numEntries) || numEntries <= 0) {
            console.log("Please enter a valid number.");
            start();
            return;
        }

        // Ask user to add the specified number of entries
        let count = 0;
        function addMultipleEntries() {
            if (count < numEntries) {
                addNewEntry(rl);
                count++;
            } else {
                console.log("All entries added.");
                rl.close();
            }
        }
        addMultipleEntries();
    });
}

start();
