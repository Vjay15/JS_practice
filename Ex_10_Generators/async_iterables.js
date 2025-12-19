// Async Iterators
let range = {
    from:1,
    to:10,
    [Symbol.asyncIterator](){
        return {
            current:this.from,
            last:this.to,

            async next(){
                await new Promise(resolve => setTimeout(resolve,500));
                
                if(this.current<=this.last){
                    return {done:false,value:this.current++};
                }
                else{
                    return {done:true};
                }
            }
        };
    }
};

// Async generators

async function* generateSequence(){
    for(let i=0;i<=5;i++){
        await new Promise(resolve => setTimeout(resolve,100));
        yield i;
    }
}

// Async iterable that works like a generator
let range_async = {
    from:1,
    to:5,
    async *[Symbol.asyncIterator](){
        for(let i = this.from;i<=this.to;i++){
            await new Promise(resolve => {setTimeout(resolve,250)});
            yield i;
        }
    }
};

(async () => {
    console.log('AsyncIterator (range):');
    for await (let value of range){
        console.log(value);
    }
    
    console.log('\nAsync generator (generateSequence):');
    let gen = generateSequence();
    for await(let val of gen){
        console.log(val);
    }

    console.log("\nAsync iterable generator");
    for await(let value of range_async){
        console.log(value);
    }
})();