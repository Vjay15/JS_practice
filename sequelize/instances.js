import { Users, close_db, create_tables } from "./models.js";
const vjay = Users.build({firstName:"Vjay",lastName:"Lakshman",email:"vjay@example.com",phone:"8925127476",city:"Chennai",age:21})
async function save_user(){
    await vjay.save()
    .then(res => console.log(res))
    .catch(err => console.log(err))
}
async function update_user(){
    await vjay.update({
        email:"vjay@cool.com"
    })
    await save_user()
    
}
async function delete_user(){
    await vjay.destroy();
}

async function main(){
    await create_tables(); // Create tables first
    await save_user();
    // await update_user();
    // await delete_user();
    await close_db();
}

main();