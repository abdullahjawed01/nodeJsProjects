import fs from "fs/promises"

let DB = "/home/abdullah/nodeJsProjects/07To-Do /db.json"

    
async function readDB() {
    try {
    let userData = await fs.readFile(DB,"utf-8")
    return JSON.parse(userData)
    } catch (error) {
        console.log(error);
    }
}
async function writeDB(content) {
    try {
    await fs.writeFile(DB,JSON.stringify(content,null,2))
     } catch (error) {
        
    }
}
export {readDB,writeDB}