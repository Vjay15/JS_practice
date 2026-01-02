import {Users, Logs, close_db, sequelize} from './models.js'
import { Op } from 'sequelize';

async function runQueries() {
// Basic queries
const users = await Users.findAll();
console.log('All users', JSON.stringify(users, null, 2));
console.log('');

const users_attrb = await Users.findAll({
    attributes: ['firstName', 'lastName']
});
console.log('All users lastname and firstname', JSON.stringify(users_attrb, null, 2));
console.log('');

const users_where = await Users.findAll({
    where: {
        city: 'Bangalore'
    }
});
console.log('All users whose city is Bangalore', JSON.stringify(users_where, null, 2));
console.log('');

// Comparison Operators
const users_eq = await Users.findAll({
    where: {
        age: { [Op.eq]: 25 }  // age = 25
    }
});
console.log('Users with age = 25', JSON.stringify(users_eq, null, 2));
console.log('');

const users_ne = await Users.findAll({
    where: {
        age: { [Op.ne]: 25 }  // age != 25
    }
});
console.log('Users with age != 25', JSON.stringify(users_ne, null, 2));
console.log('');

const users_gt = await Users.findAll({
    where: {
        age: { [Op.gt]: 34 }  // age > 34
    }
});
console.log('Users with age > 34', JSON.stringify(users_gt, null, 2));
console.log('');

const users_gte = await Users.findAll({
    where: {
        age: { [Op.gte]: 34 }  // age >= 34
    }
});
console.log('Users with age >= 34', JSON.stringify(users_gte, null, 2));
console.log('');

const users_lt = await Users.findAll({
    where: {
        age: { [Op.lt]: 25 }  // age < 25
    }
});
console.log('Users with age < 25', JSON.stringify(users_lt, null, 2));
console.log('');

const users_lte = await Users.findAll({
    where: {
        age: { [Op.lte]: 25 }  // age <= 25
    }
});
console.log('Users with age <= 25', JSON.stringify(users_lte, null, 2));
console.log('');

const users_between = await Users.findAll({
    where: {
        age: { [Op.between]: [25, 40] }  // age BETWEEN 25 AND 40
    }
});
console.log('Users with age BETWEEN 25 AND 40', JSON.stringify(users_between, null, 2));
console.log('');

// IN and NOT IN operators
const users_in = await Users.findAll({
    where: {
        city: { [Op.in]: ['Delhi', 'Bangalore', 'Kanpur'] }  // city IN ('New York', 'Los Angeles', 'Chicago')
    }
});
console.log('Users in specific cities', JSON.stringify(users_in, null, 2));
console.log('');

const users_notIn = await Users.findAll({
    where: {
        city: { [Op.notIn]: ['Bangalore', 'Kanpur'] }  
    }
});
console.log('Users NOT in specific cities', JSON.stringify(users_notIn, null, 2));
console.log('');

// LIKE operators
const users_like = await Users.findAll({
    where: {
        firstName: { [Op.like]: '%ram%' }  // firstName LIKE '%ram%'
    }
});
console.log('Users with firstName containing "ram"', JSON.stringify(users_like, null, 2));
console.log('');

const users_startsWith = await Users.findAll({
    where: {
        firstName: { [Op.startsWith]: 'V' }  // firstName LIKE 'v%'
    }
});
console.log('Users with firstName starting with "V"', JSON.stringify(users_startsWith, null, 2));
console.log('');

const users_endsWith = await Users.findAll({
    where: {
        email: { [Op.endsWith]: '@gmail.com' }  // email LIKE '%@gmail.com'
    }
});
console.log('Users with email ending with "@gmail.com"', JSON.stringify(users_endsWith, null, 2));
console.log('');

const users_iLike = await Users.findAll({
    where: {
        firstName: { [Op.iLike]: '%john%' }  // firstName ILIKE '%john%' (case insensitive)
    }
});
console.log('Users with firstName containing "john" (case insensitive)', JSON.stringify(users_iLike, null, 2));
console.log('');

// NULL operators
const users_isNull = await Users.findAll({
    where: {
        lastName: { [Op.is]: null }  // lastName IS NULL
    }
});
console.log('Users with NULL lastName', JSON.stringify(users_isNull, null, 2));
console.log('');

// AND and OR operators
const users_and = await Users.findAll({
    where: {
        [Op.and]: [
            { age: { [Op.gte]: 25 } },
            { city: 'Chennai' }
        ]  // (age >= 25) AND (city = 'Chennai')
    }
});
console.log('Users with age >= 25 AND city = Chennai', JSON.stringify(users_and, null, 2));
console.log('');

const users_or = await Users.findAll({
    where: {
        [Op.or]: [
            { age: { [Op.lt]: 25 } },
            { age: { [Op.gt]: 50 } }
        ]  // (age < 25) OR (age > 50)
    }
});
console.log('Users with age < 25 OR age > 50', JSON.stringify(users_or, null, 2));
console.log('');

// Complex query combining multiple operators
const users_complex = await Users.findAll({
    where: {
        [Op.and]: [
            { age: { [Op.between]: [20, 60] } },
            {
                [Op.or]: [
                    { city: { [Op.in]: ['New York', 'Los Angeles', 'Chicago'] } },
                    { email: { [Op.like]: '%@gmail.com' } }
                ]
            }
        ]
    }
});
console.log('Complex query: age between 20-60 AND (city in major cities OR email is gmail)', JSON.stringify(users_complex, null, 2));
console.log('');

// ========== AGGREGATE FUNCTIONS WITH GROUP BY AND HAVING ==========

// Count users by city
const usersByCity = await Users.findAll({
    attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
    ],
    group: ['city'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
});
console.log('=== GROUP BY: Users count by city ===');
console.log(JSON.stringify(usersByCity, null, 2));
console.log('');

// Count users by city, only show cities with more than 1 user (HAVING)
const citiesWithMultipleUsers = await Users.findAll({
    attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
    ],
    group: ['city'],
    having: sequelize.where(
        sequelize.fn('COUNT', sequelize.col('id')),
        Op.gt,
        1
    ),
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
});
console.log('=== GROUP BY + HAVING: Cities with more than 1 user ===');
console.log(JSON.stringify(citiesWithMultipleUsers, null, 2));
console.log('');


// Count users by email domain
const usersByEmailDomain = await Users.findAll({
    attributes: [
        [sequelize.fn('SUBSTRING', sequelize.col('email'), sequelize.literal("POSITION('@' IN email) + 1")), 'emailDomain'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'userCount']
    ],
    group: [sequelize.fn('SUBSTRING', sequelize.col('email'), sequelize.literal("POSITION('@' IN email) + 1"))],
    having: sequelize.where(
        sequelize.fn('COUNT', sequelize.col('id')),
        Op.gt,
        0
    ),
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
});
console.log('=== GROUP BY: Users count by email domain ===');
console.log(JSON.stringify(usersByEmailDomain, null, 2));
console.log('');

// ========== ORDERING EXAMPLES ==========

// Order by single column ascending
const usersOrderedByAgeAsc = await Users.findAll({
    order: [['age', 'ASC']],
    limit: 5,
    attributes: ['firstName', 'lastName', 'age', 'city']
});
console.log('=== ORDERING: Users ordered by age ASC (top 5) ===');
console.log(JSON.stringify(usersOrderedByAgeAsc, null, 2));
console.log('');

// Order by single column descending
const usersOrderedByAgeDesc = await Users.findAll({
    order: [['age', 'DESC']],
    limit: 5,
    attributes: ['firstName', 'lastName', 'age', 'city']
});
console.log('=== ORDERING: Users ordered by age DESC (top 5) ===');
console.log(JSON.stringify(usersOrderedByAgeDesc, null, 2));
console.log('');

// Order by multiple columns (primary: age DESC, secondary: firstName ASC)
const usersOrderedMultiple = await Users.findAll({
    order: [
        ['age', 'DESC'],
        ['firstName', 'ASC']
    ],
    limit: 10,
    attributes: ['firstName', 'lastName', 'age', 'city']
});
console.log('=== ORDERING: Users ordered by age DESC, then firstName ASC (top 10) ===');
console.log(JSON.stringify(usersOrderedMultiple, null, 2));
console.log('');

// Order by city, then age within each city
const usersOrderedByCityAndAge = await Users.findAll({
    order: [
        ['city', 'ASC'],
        ['age', 'DESC']
    ],
    attributes: ['firstName', 'lastName', 'age', 'city']
});
console.log('=== ORDERING: Users ordered by city ASC, then age DESC within each city ===');
console.log(JSON.stringify(usersOrderedByCityAndAge, null, 2));
console.log('');

// Order using raw SQL expression
const usersOrderedByEmailLength = await Users.findAll({
    order: [
        [sequelize.fn('LENGTH', sequelize.col('email')), 'DESC']
    ],
    limit: 5,
    attributes: ['firstName', 'lastName', 'email']
});
console.log('=== ORDERING: Users ordered by email length DESC (top 5) ===');
console.log(JSON.stringify(usersOrderedByEmailLength, null, 2));
console.log('');

// Order with WHERE clause
const usersOrderedWithFilter = await Users.findAll({
    where: {
        age: { [Op.gte]: 25 }
    },
    order: [
        ['city', 'ASC'],
        ['age', 'DESC'],
        ['lastName', 'ASC']
    ],
    attributes: ['firstName', 'lastName', 'age', 'city']
});
console.log('=== ORDERING: Users age >= 25, ordered by city ASC, age DESC, lastName ASC ===');
console.log(JSON.stringify(usersOrderedWithFilter, null, 2));
console.log('');

// ========== GETTERS AND VIRTUAL FIELDS ==========

// Query users and access the fullName virtual field
const usersWithFullName = await Users.findAll({
    limit: 5,
    attributes: ['id', 'firstName', 'lastName', 'email']
});
console.log('=== GETTERS/VIRTUALS: Users with fullName virtual field ===');
usersWithFullName.forEach(user => {
    console.log(`User: ${user.fullName} (${user.email})`);
    // fullName is a virtual field that combines firstName and lastName
});
console.log('');

// Get fullName for a specific user
const singleUser = await Users.findOne({
    where: { age: { [Op.gte]: 25 } },
    attributes: ['firstName', 'lastName', 'email'],
    limit:5
});
if (singleUser) {
    console.log('=== GETTERS/VIRTUALS: Single user fullName ===');
    console.log(`Full Name: ${singleUser.fullName}`);
    console.log(`First Name: ${singleUser.firstName}`);
    console.log(`Last Name: ${singleUser.lastName}`);
    console.log('');
}

// ========== ASSOCIATION QUERIES ==========

// A to B: Get user with their logs (Users → Logs)
const userWithLogs = await Users.findOne({
    include: [{
        model: Logs,
        as: 'logs',
        attributes: ['id', 'loginTime', 'logoutTime']
    }],
    attributes: ['id', 'firstName', 'lastName', 'email'],
    limit:5
});
console.log('=== ASSOCIATIONS: User with their logs (Users → Logs) ===');
if (userWithLogs) {
    console.log(`User: ${userWithLogs.fullName}`);
    console.log(`Total Logs: ${userWithLogs.logs ? userWithLogs.logs.length : 0}`);
    console.log('Logs:', JSON.stringify(userWithLogs.logs, null, 2));
}
console.log('');

// B to A: Get log with its user (Logs → Users)
const logWithUser = await Logs.findOne({
    include: [{
        model: Users,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
    }],
    attributes: ['id', 'loginTime', 'logoutTime'],
    limit:5
});
console.log('=== ASSOCIATIONS: Log with its user (Logs → Users) ===');
if (logWithUser) {
    console.log(`Log ID: ${logWithUser.id}`);
    console.log(`Login Time: ${logWithUser.loginTime}`);
    console.log(`Logout Time: ${logWithUser.logoutTime || 'Still logged in'}`);
    console.log(`User: ${logWithUser.user ? logWithUser.user.fullName : 'N/A'}`);
}
console.log('');

// ========== PARANOID QUERIES (SOFT DELETES) ==========

// First, get a log to delete
const logToDelete = await Logs.findOne({
    order: [['loginTime', 'DESC']]
});

if (logToDelete) {
    console.log('=== PARANOID: Before soft delete ===');
    console.log(`Log ID: ${logToDelete.id}`);
    console.log(`DeletedAt: ${logToDelete.deletedAt || 'null (not deleted)'}`);
    console.log('');

    // Soft delete the log (sets deletedAt timestamp)
    await Logs.destroy({
        where: { id: logToDelete.id },
        paranoid:false
    });
    console.log('=== PARANOID: After soft delete ===');
    
    // Try to find the deleted log (should return null by default)
    const deletedLog = await Logs.findByPk(logToDelete.id);
    console.log(`Found deleted log (default): ${deletedLog ? 'Yes' : 'No'}`);
    
    // Find with paranoid: false to see deleted records
    const deletedLogWithParanoid = await Logs.findByPk(logToDelete.id, {
        paranoid: false
    });
    console.log(`Found deleted log (paranoid: false): ${deletedLogWithParanoid ? 'Yes' : 'No'}`);
    if (deletedLogWithParanoid) {
        console.log(`DeletedAt timestamp: ${deletedLogWithParanoid.deletedAt}`);
        console.log('Full record:', JSON.stringify(deletedLogWithParanoid.toJSON(), null, 2));
    }
    console.log('');

    // Get all non-deleted logs
    const activeLogs = await Logs.findAll({
        limit: 3,
        attributes: ['id', 'loginTime', 'logoutTime']
    });
    console.log('=== PARANOID: Active (non-deleted) logs ===');
    console.log(`Count: ${activeLogs.length}`);
    console.log(JSON.stringify(activeLogs, null, 2));
    console.log('');

    // Get all logs including deleted ones
    const allLogsIncludingDeleted = await Logs.findAll({
        paranoid: false,
        limit: 5,
        attributes: ['id', 'loginTime', 'logoutTime', 'deletedAt']
    });
    console.log('=== PARANOID: All logs including deleted ===');
    console.log(`Count: ${allLogsIncludingDeleted.length}`);
    allLogsIncludingDeleted.forEach(log => {
        console.log(`Log ID: ${log.id}, DeletedAt: ${log.deletedAt || 'null (active)'}`);
    });
    console.log('');

    // Restore the deleted log
    await Logs.restore({
        where: { id: logToDelete.id }
    });
    console.log('=== PARANOID: After restore ===');
    const restoredLog = await Logs.findByPk(logToDelete.id);
    console.log(`Found restored log: ${restoredLog ? 'Yes' : 'No'}`);
    if (restoredLog) {
        console.log(`DeletedAt: ${restoredLog.deletedAt || 'null (restored)'}`);
    }
    console.log('');

    // Hard delete (actually removes from database)
    await Logs.destroy({
        where: { id: logToDelete.id },
        force: true
    });
    console.log('=== PARANOID: After hard delete (force: true) ===');
    const hardDeletedLog = await Logs.findByPk(logToDelete.id, {
        paranoid: false
    });
    console.log(`Found hard-deleted log: ${hardDeletedLog ? 'Yes' : 'No'}`);
    console.log('(Hard delete permanently removes the record)');
    console.log('');
}

await close_db();
}
/* in order to truncate
await Users.destroy({
    truncate:true,
}) */
runQueries();