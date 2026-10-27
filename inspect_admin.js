const fs = require('fs');
const html = fs.readFileSync('c:/my works/white mist/admin.html', 'utf8');
const viewMatches = html.match(/id=["']view-[a-zA-Z0-9_\-]+["']/g) || [];
console.log('Existing views:', viewMatches);

const navMatches = html.match(/data-view=["'][a-zA-Z0-9_\-]+["']/g) || [];
console.log('Existing nav items:', navMatches);
