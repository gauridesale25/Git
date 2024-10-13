const fs = require("fs");
const path = require("path");
const CatFileCommand = require("./git/commands/cat-file");
const HashObjectCommand = require("./git/commands/hash-object");
const LSTreeCommand = require("./git/commands/ls-tree");

//import HashObjectCommand from './git/commands/hash-object';
const GitClient = require("./git/client"); // Correct the path



const gitClient = new GitClient();

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
    break;
  case "hash-object":
    handleHashObjectCommand();
    break;
  case "ls-tree":
    createTree();
    break;
  case "write-tree":
    writeTree();
    break;
    
  default:
    throw new Error(`Unknown command ${command}`);
}

function createTree() {
  let flag = process.argv[3];
  let sha =process.argv[4];
  if(!sha && flag ==="--name-only") return;
  if(!sha){
    sha=flag;
    flag=null;
  }
  const command =new LSTreeCommand(flag,sha)
  gitClient.run(command);
  }



function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}

function handleCatFileCommand() {
  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  if (!flag || !commitSHA) {
    throw new Error("Usage: cat-file <flag> <commitSHA>");
  }
  

  const command = new CatFileCommand(flag, commitSHA);
  gitClient.run(command);
}
function handleHashObjectCommand()
  {
    let flag=process.argv[3];
    let filepath = process.argv[4];
     if(!filepath){
      filepath=flag;
      flag=null; 
     }
     const command =new HashObjectCommand(flag,filepath);
     gitClient.run(command);

}