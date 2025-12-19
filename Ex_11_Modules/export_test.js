import {sayHi as hi, sayHello as hello} from "./export_types.js";
import * as say from "./export_types.js"
import User from "./users.js";
import huh from "./export_types.js";

hi();
hello();
say.sayHello();
say.sayHi();

let user = new User("vjay");
user.sayHi();

huh();

// Dynamic imports return a Promise, so we need to await it
(async () => {
    let obj = await import("./dynamic.js");
    console.log(obj.name);
    let shoot = obj.default;
    shoot();
    obj.test();
})();