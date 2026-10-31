const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

process.env.PATH = `C:\\Users\\ranjith\\AppData\\Local\\Programs\\Git\\cmd;${process.env.PATH}`;

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (e) {
    return (e.stdout ? e.stdout.toString() : '') + (e.stderr ? e.stderr.toString() : '') + e.message;
  }
}

console.log('Global User Name:', safeExec('git config --global user.name'));
console.log('Global User Email:', safeExec('git config --global user.email'));
console.log('Credential Helper:', safeExec('git config --global credential.helper'));

const sshDir = 'C:\\Users\\ranjith\\.ssh';
if (fs.existsSync(sshDir)) {
  console.log('.ssh directory files:', fs.readdirSync(sshDir));
} else {
  console.log('.ssh directory does not exist');
}
