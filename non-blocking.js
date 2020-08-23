let fs = require('fs');

fs.readFile('text.txt', (err, data) => {
    if(err) {
        console.log(err);
    }
    console.log('Display after read');
});

console.log('start here');
