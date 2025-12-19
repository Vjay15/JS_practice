export default class User{
    constructor(name){
        this.name=name;
    }
    sayHi(){
        console.log(`The name is ${this.name}`);
    }
}