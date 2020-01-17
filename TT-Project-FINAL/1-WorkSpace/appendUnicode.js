var fs  = require("fs"); 

function myChars() { // convert to JavaScript Unicode format
    let readFile = fs.readFileSync("../1-WorkSpace/CJK_Charset.txt", "utf8"); 
    let regexChars = /(?:U+\W\d...)/gm; // regex for U+
   
    let match  = readFile.match(regexChars);// match every U+
    
    for ( var i = 0; i < match.length; i++){
        match[i] = match[i].replace('U\+', '\\u'); // replace U+ with \u
    }
   
   
    return match
}

module.exports.appendUnicode = function conCat(line) {
    
    let rep = line.replace(/"/gm, "");
    let Value = rep;
    let newVAL = Value.length * 1.32;//creating the line to be 32% larger than 
    let charSize = Math.round(newVAL - Value.length);// round the value
    var result = "";
    let unicodeArr = [];

    var codes = myChars(); //append array of unicode values from randomChar function  

    for (let i = 0; i <= charSize; i++) {

        if (i) {
            let unicodePoint = codes[Math.floor(Math.random() * codes.length)];// generate random unicode codepoint
            unicodeArr.push(unicodePoint)// append to unicodeArr array
        }
        result = Value + "_" + unicodeArr.join("") + '"';


    }
    return result;
    
};
