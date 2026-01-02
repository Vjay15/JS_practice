import { Sequelize, DataTypes } from 'sequelize';
import crypto from 'crypto';

export const sequelize = new Sequelize(
    'learn_psql',
    'vjaylakshman.k',
    null,
    {
    host: 'localhost',
    dialect:'postgres',
})

export const Users = sequelize.define(
    'Users',
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            defaultValue: DataTypes.UUIDV4
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING,
        },
        email:{
            type:DataTypes.STRING,
            defaultValue:'NA',
            validate:{
                isEmail:true
            }
        },
        phone:{
            type:DataTypes.STRING,
            unique:true,
            validate:{
                is: /^[6-9][0-9]{9}$/,
                len: [10, 10]
            }
        },
        city:{
            type:DataTypes.STRING,
            defaultValue:'NA'
        },
        age:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                min:0,
                max:150
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                // Hash the password using SHA-256 (you can use bcrypt for better security)
                const hash = crypto.createHash('sha256').update(value).digest('hex');
                this.setDataValue('password', hash);
            }
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.firstName} ${this.lastName}`.trim();
            }
        }
    },
    {
        freezeTableName:true,
    }
)

// Logs model - tracks user login/logout times
export const Logs = sequelize.define(
    'Logs',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Users,
                key: 'id'
            },
            onDelete: 'CASCADE',  // Delete logs when user is deleted
            onUpdate: 'CASCADE'    // Update logs when user id is updated
        },
        loginTime: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        logoutTime: {
            type: DataTypes.DATE,
            allowNull: true  // Can be null if user hasn't logged out yet
        }
    },
    {
        freezeTableName: true,
        createdAt:false,
        paranoid: true  // Enables soft deletes (Sequelize automatically adds deletedAt column)
    }
)

// Define associations
// Users hasMany Logs (one-to-many relationship)
Users.hasMany(Logs, {
    foreignKey: 'userId',
    as: 'logs',  
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

// Logs belongsTo Users
Logs.belongsTo(Users, {
    foreignKey: 'userId',
    as: 'user',  
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

export async function create_tables(){
    await sequelize.sync({ alter: true })  // alter: true adds missing columns (Sequelize automatically adds deletedAt when paranoid: true)
    .then(res => console.log("The table is successfully created"))
    .catch(err => console.log("An error has occured",err))
}
async function delete_tables(){
    await sequelize.drop()
    .then(res => console.log("The tables were dropped successfully"))
    .catch(err => console.log("An error has occured",err))
}
export async function close_db(){
    await sequelize.close()
    .then(() => {console.log("Closed successfully!")})
    .catch((err) => {console.log("An error has occured",err)})
}

// Uncomment to run when models.js is executed directly
// async function main(){
//     await create_tables();
//     await delete_tables();
//     await close_db();
// }
// main();

// console.log(Users === sequelize.models.Users);