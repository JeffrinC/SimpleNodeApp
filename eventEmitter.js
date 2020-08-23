let fs = require('fs');
let event = require('events');

const myEmitter = new event.EventEmitter();

fs.readFile('text.txt', (err, data) => {
    console.log(data.toString());
    myEmitter.emit('readFile');
});

myEmitter.addListener('readFile', () => {
    console.log('\n Read event occurred')
})

console.log('start here');
