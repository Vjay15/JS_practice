/*
- Modules should always be in 'use strict' mode
- just because a module is imported doesn't mean you gain access to the entire
module's variables and funcitons, only functions and variables specified by 
'export' can be exported
- The imports that are made to parent modules of a file is also carried forward
- Therefore even if the import is made again in the next child file, the 
configurations are carried forward, the values are shared among files that 
share the same import too!
- For a module the 'this' is undefined, but in case of a non module js
it is usually window in case of browsers and scripts in case of a nodejs script
- In pages, as usual scripts are deferred but modules are deferred after the 
scripts are done
- Webpack is a bundler that does optimizations on the given code and bundles all
modules into a single bundle.js file
*/
export let name = {};
export function sayHello(){
    console.log("Hello!",name.name);
}