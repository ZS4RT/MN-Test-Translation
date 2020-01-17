var fs = require('fs');
var path = require("path")

var ImportNewValueStr = require("./appendUnicode.js"); //
const { app, mainWindow, BrowserWindow, dialog, ipcMain } = require('electron')

//creates application window
function createWindow() {
    let win = new BrowserWindow({
        width: 1350,
        height: 600,
        icon: './MN small logo.png',
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setMenu(null)

    win.loadFile('browse.html')


    // browse button 
    ipcMain.on("browsebtn", function(event) {

        dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory', 'multiSelections']
        }).then(result => {

            result = result.filePaths.toString(); // returns absolute path

            findTranslationFile(result)

        });

    });

}

app.on('ready', createWindow)


function findTranslationFile(directory) {
    fs.readdirSync(directory).forEach(function(file) {
        let fullPath = path.join(directory, file);
        let match = fullPath.match(/Messages_en.ts/gm);
        fullPath = fullPath.replace(/\\/g, "/");

        if (fullPath.includes(match)) {
            for (i = 0; i <= match.length; i++) {
                convertI10n(fullPath)
                console.log(fullPath)
            }
        }
        if (fs.lstatSync(fullPath).isDirectory()) {
            findTranslationFile(fullPath);
        }
    });

}

function convertI10n(i10nPath) {

    var readline = require("readline");

    //Pattern represents the match of a regex
    let keyPattern = /\w\s*[a-zA-z]+[\:="]\s"/gm;
    let valuePatternpluscomma = /(".*?",)/gm;
    let valuePattern = /(".*?")/gm;

    let filename = path.basename(i10nPath)

    function createNewFileName() {

        let replaceType = /_en.ts/gm;
        let newType = filename.replace(replaceType, "_gl_ES.ts");
        let dirname = path.dirname(i10nPath)

        let completedPath = dirname + "/" + newType;
        console.log(completedPath)

        return completedPath;
    }

    createNewFileName(i10nPath)

    var writeStream = fs.createWriteStream(createNewFileName(), "utf8");

    var readline = readline.createInterface({

        // reading in each i10n path
        input: fs.createReadStream(i10nPath, "utf8")

    });

    readline.on("line", function(line) {

        let keys = line.match(keyPattern); // matches the KEY

        if (keys) {
            let key = keys[0]; // One match per line expected. keyStr equals to example: NOT_FOUND_TITLE: "
            let values = line.match(valuePatternpluscomma);
            if (!values) {
                values = line.match(valuePattern);
            }
            let value = values[0] // valueStr equals to:     Ex. '"Page not found",'

            key = key.replace('"', " ");
            value = value.replace(/",.*?/g, "");

            let newValue = ImportNewValueStr.appendUnicode(value);
            let newKeyValuePair = keys + newValue + ',';
            console.log(newKeyValuePair);
            writeStream.write(newKeyValuePair + "\n"); // write to the file
        }

        // if a KEY is not found write the line
        if (!keys) {
            console.log(line);

            writeStream.write(line + "\n"); // write to the file

        }
    });

    readline.on('close', function() {

        writeStream.close(); // close the write line

        readline.close(); //close the readline


    });

}