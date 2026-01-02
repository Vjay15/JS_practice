const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    'learn_psql',
    'vjaylakshman.k',
    null,
    {
    host: 'localhost',
    dialect:'postgres',
    logging: (...msg) => console.log(msg)
})

async function test_conn(){
    await sequelize.authenticate();
    await sequelize.close()
    .then(() => {console.log("Closed successfully!")})
    .catch((err) => {console.log("An error has occured",err)})
}

try {
    test_conn();
    console.log('Connection has been established successfully');
}
catch(err){
    console.log('Unable to connect to the databse: ', error);
}