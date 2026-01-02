import { Users, close_db } from './models.js';
import { Op } from 'sequelize';

async function runFinders() {
    // 1. findAll - Get all records
    const allUsers = await Users.findAll();
    console.log('=== findAll: All users ===');
    console.log(JSON.stringify(allUsers, null, 2));
    console.log('');

    // findAll with WHERE clause
    const usersInChennai = await Users.findAll({
        where: { city: 'Chennai' }
    });
    console.log('=== findAll: Users in Chennai ===');
    console.log(JSON.stringify(usersInChennai, null, 2));
    console.log('');

    // 2. findByPk - Find by primary key
    // First, get a user ID from the database
    const firstUser = await Users.findOne();
    if (firstUser) {
        const userById = await Users.findByPk(firstUser.id);
        console.log('=== findByPk: User by ID ===');
        console.log(JSON.stringify(userById, null, 2));
        console.log('');
    }

    // 3. findOne - Find a single record
    const oneUser = await Users.findOne({
        where: { city: 'Bangalore' }
    });
    console.log('=== findOne: One user from Bangalore ===');
    console.log(JSON.stringify(oneUser, null, 2));
    console.log('');

    // findOne with ordering (gets first match)
    const oldestUser = await Users.findOne({
        order: [['age', 'DESC']]
    });
    console.log('=== findOne: Oldest user ===');
    console.log(JSON.stringify(oldestUser, null, 2));
    console.log('');

    // 4. findOrCreate - Find or create if not exists
    const [user, created] = await Users.findOrCreate({
        where: { email: 'newuser@example.com' },
        defaults: {
            firstName: 'Aditya',
            lastName: 'Kumar',
            phone: '9876543210',
            password: 'password123',
            city: 'Mumbai',
            age: 25
        }
    });
    console.log('=== findOrCreate ===');
    console.log('User:', JSON.stringify(user.toJSON(), null, 2));
    console.log('Was created:', created);
    console.log('');

    // Try findOrCreate again (should find, not create)
    const [user2, created2] = await Users.findOrCreate({
        where: { email: 'newuser@example.com' },
        defaults: {
            firstName: 'Aditya',
            lastName: 'Kumar',
            phone: '9876543210',
            password: 'password123',
            city: 'Mumbai',
            age: 25
        }
    });
    console.log('=== findOrCreate (second time) ===');
    console.log('User:', JSON.stringify(user2.toJSON(), null, 2));
    console.log('Was created:', created2);
    console.log('');

    // 5. findAndCountAll - Find records and get total count
    const { count, rows } = await Users.findAndCountAll({
        where: { age: { [Op.gte]: 30 } },
        limit: 5,
        offset: 0
    });
    console.log('=== findAndCountAll: Users age >= 30 ===');
    console.log('Total count:', count);
    console.log('Rows returned:', rows.length);
    console.log('Users:', JSON.stringify(rows, null, 2));
    console.log('');

    await close_db();
}

runFinders();

