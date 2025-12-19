const fs = require('fs');
// preferable way of reading from files (Streams)

// Method 1: Piping (for copying files)
const read = fs.createReadStream('test_2.txt');
const write = fs.createWriteStream('text_4.txt');
read.pipe(write);
read.on('error', (err) => console.error('Read error:', err));
write.on('error', (err) => console.error('Write error:', err));
write.on('finish', () => console.log('\nFile copied successfully via pipe!'));

// Method 2: Reading stream data with event listeners
const stream = fs.createReadStream('test_2.txt', { encoding: 'utf-8' });
let streamData = '';

stream.on('data', (chunk) => {
    streamData += chunk;
    console.log('\nReceived chunk:', chunk);
});

stream.on('end', () => {
    console.log('\nStream reading complete!');
    console.log('Full data:', streamData);
});

stream.on('error', (err) => {
    console.error('Stream error:', err);
});

// Method 3: Using async iteration (modern approach)
(async () => {
    const asyncStream = fs.createReadStream('test_2.txt', { encoding: 'utf-8' });
    let asyncData = '';
    
    for await (const chunk of asyncStream) {
        asyncData += chunk;
    }
    console.log('\nAsync iteration result:', asyncData);
})();