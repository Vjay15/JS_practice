const math = require('./math.js');
const fs = require("fs")
console.log(math.add(5, 3));      
console.log(math.sub(5, 3));      
console.log(math.mul(5, 3));      
console.log(math.div(5, 3));      

// callback based fs (legacy)
fs.writeFile('test.txt','Hello I am writing to a file','utf-8',(err) => {
    console.log("\n-----Asynchronous FS tasks with callback-----")
    if(err) throw err;
    console.log("\nWritten successfully!");
})
fs.appendFile('test.txt','\nBello this is a test','utf-8',(err) => {
    if(err) throw err;
    console.log("\nAppended successfully");
});

fs.readFile('test.txt','utf-8',(err,data) => {
    if(err) throw err;
    console.log("\nThe contents fo the file are:");
    console.log(data);
});
(async () => {
    try {
        await fs.promises.writeFile('test_3.txt','This is a promise based write','utf-8');
        console.log("\n-----Asynchronous FS tasks with promises-----")
        console.log('Written successfully with promises!');
    } catch(err) {
        console.log('Error:', err.name, err.message);
    }

    try {
        await fs.promises.appendFile('test_3.txt','\nThis is a promise based append','utf-8');
        console.log('\nAppended successfully with promise!');
    }
    catch(err){
        console.log('Error:', err.name, err.message);
    }

    try{
        let data = await fs.promises.readFile('test_3.txt','utf-8');
        console.log("\nThe text inside the file is:");
        console.log(data);
    }
    catch(err){
        console.log('Error:',err.name,err.message);
    }
})();

// sync based fs
console.log('\n-----Synchronous FS tasks-----')
console.log("\nSynchronous Write");
fs.writeFileSync('test_2.txt','This is a sync based write','utf-8');
console.log("\nSynchronous Append");
fs.appendFileSync('test_2.txt','\nThis is a sync based append','utf-8');
let data = fs.readFileSync('test_2.txt','utf-8');
console.log("\nThe contents of the file are:");
console.log(data);
