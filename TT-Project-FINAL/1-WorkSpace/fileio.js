let str = "C:/Users/zshoaib/Documents/TT-Project/1-WorkSpace/CommonBaseI10nMessages_en.ts"

var path = require("path")



var filename =  path.basename(str)
let newFileName2 = path.dirname(str)

function newFileName(file) {

    let replaceType = /_en.ts/gm;
    let newType = filename.replace(replaceType, "_gl_ES.ts");
    
    console.log(newType)    

}

newFileName(filename)


console.log(newFileName2)