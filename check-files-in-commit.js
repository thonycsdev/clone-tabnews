const { exec } = require("child_process");

function checkCommitFiles() {
  console.log("- Checking staged files...");
  exec("git diff --cached --name-only", handleCallback);
}

function handleCallback(err, stdout) {
  if (err) {
    printErrorMsg(err);
  }
  const files = stdout.trim().split("\n");

  checkFilesAmount(files);
  checkForForbiddenFiles(files);
  console.log("All files are good to go!");
  process.exit(0);
}

function checkFilesAmount(files) {
  if (files.length === 0) {
    printErrorMsg("No files to check");
    process.exit(1);
  }
}

function checkForForbiddenFiles(files) {
  const filesToExclude = [".env"];

  if (files.includes(...filesToExclude)) {
    printErrorMsg("You are trying to commit .env file");
    process.exit(1);
  }
}

function printErrorMsg(msg) {
  console.error(`- Error while cheking files: ${msg}`);
}

checkCommitFiles();
