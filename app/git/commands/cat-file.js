const path = require("path"); 
const fs = require('fs');
const zlib = require("zlib");

class CatFileCommand {
    constructor(flag, commitSHA) {
      this.flag = flag;
      this.commitSHA = commitSHA;
    }
  
    execute() {
      const folder = this.commitSHA.slice(0, 2);
      const file = this.commitSHA.slice(2);
      
      const completePath = path.join(
        process.cwd(), 
        ".git", 
        "objects", 
        folder, 
        file
      );
      
      if (!fs.existsSync(completePath)) {
        throw new Error(`Not a valid object name ${this.commitSHA}`);
      }
  
      const fileContents = fs.readFileSync(completePath);
      const outputBuffer = zlib.inflateSync(fileContents);
      const output = outputBuffer.toString().split("\x00")[1];
  
      process.stdout.write(output);
    }
  }
  
module.exports = { CatFileCommand };
