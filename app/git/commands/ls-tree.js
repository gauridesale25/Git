const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class LSTreeCommand {
    constructor(flag, sha) {
        this.flag = flag;
        this.sha = sha;
    }

    execute() {
        const sha = this.sha;

        
        const folder = sha.slice(0, 2);
        const file = sha.slice(2);

        const folderPath = path.join(process.cwd(), ".git", "objects", folder);
        const filepath = path.join(folderPath, file);

        
        if (!fs.existsSync(folderPath)) {
            throw new Error(`Not a valid object name ${sha}`);
        }
        if (!fs.existsSync(filepath)) {
            throw new Error(`Not a valid object name ${sha}`);
        }

        
        const fileContent = fs.readFileSync(filepath);
        const outputBuffer = zlib.inflateSync(fileContent);
        const output = outputBuffer.toString('binary'); // Trees are binary data

        let i = 0;
        while (i < output.length) {
            
            let modeEnd = output.indexOf(' ', i);
            if (modeEnd === -1) break; // Prevent infinite loop if we can't find a space
            let mode = output.slice(i, modeEnd);
            i = modeEnd + 1;

            
            let nameEnd = output.indexOf('\0', i);
            if (nameEnd === -1) break; 
            let name = output.slice(i, nameEnd);
            i = nameEnd + 1;

            
            let sha = output.slice(i, i + 20);
            sha = Buffer.from(sha, 'binary').toString('hex');
            i += 20; 
            
            let type = mode.startsWith('04') ? 'tree' : 'blob';

            
            process.stdout.write(`${mode} ${type} ${sha}    ${name}\n`);
        }
    }
}

module.exports = LSTreeCommand;
