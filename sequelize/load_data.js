import { Users, Logs, close_db, create_tables } from "./models.js";

// Sample data arrays - Indian names and cities
const firstNames = ['Raj', 'Priya', 'Amit', 'Anjali', 'Rahul', 'Kavya', 'Vikram', 'Sneha', 'Arjun', 'Divya', 'Karan', 'Meera', 'Rohan', 'Pooja', 'Siddharth'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Mehta', 'Desai', 'Joshi', 'Shah', 'Agarwal', 'Malhotra', 'Verma', 'Iyer', 'Nair'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'];

// Function to get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to generate random email
function generateEmail(firstName, lastName) {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
}

// Function to generate random age between 18 and 80
function getRandomAge() {
    return Math.floor(Math.random() * (80 - 18 + 1)) + 18;
}

// Function to generate valid 10-digit Indian phone number
function generateIndianPhone() {
    // First digit must be 6, 7, 8, or 9
    const firstDigit = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    // Generate remaining 9 digits
    let phone = firstDigit.toString();
    for (let i = 0; i < 9; i++) {
        phone += Math.floor(Math.random() * 10).toString();
    }
    return phone;
}

// Function to generate random password
function generatePassword() {
    // Generate a simple password (will be hashed automatically by setter)
    const passwords = ['password123', 'secret123', 'mypass123', 'secure123', 'admin123', 'user123'];
    return passwords[Math.floor(Math.random() * passwords.length)];
}

// Function to generate random date within last 30 days
function getRandomDate(startDate, endDate) {
    const start = startDate.getTime();
    const end = endDate.getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime);
}

// Function to generate login/logout times
function generateLoginTimes() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Generate login time within last 30 days
    const loginTime = getRandomDate(thirtyDaysAgo, now);
    
    // 70% chance user has logged out (logoutTime exists)
    const hasLoggedOut = Math.random() > 0.3;
    
    let logoutTime = null;
    if (hasLoggedOut) {
        // Logout time is between login time and now
        const maxLogoutTime = new Date(Math.min(loginTime.getTime() + (8 * 60 * 60 * 1000), now.getTime())); // Max 8 hours session
        logoutTime = getRandomDate(loginTime, maxLogoutTime);
    }
    
    return { loginTime, logoutTime };
}

// Function to generate 15 random users
async function loadRandomData() {
    const usersData = [];
    
    for (let i = 0; i < 15; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        
        usersData.push({
            firstName: firstName,
            lastName: lastName,
            email: generateEmail(firstName, lastName),
            phone: generateIndianPhone(),
            password: generatePassword(), // Will be automatically hashed by setter
            city: getRandomElement(cities),
            age: getRandomAge()
        });
    }
    
    try {
        const users = await Users.bulkCreate(usersData);
        console.log(`Successfully created ${users.length} users!`);
        
        // Create login records for each user (2-5 logins per user)
        const loginData = [];
        for (const user of users) {
            const numLogins = Math.floor(Math.random() * 4) + 2; // 2 to 5 logins per user
            
            for (let i = 0; i < numLogins; i++) {
                const { loginTime, logoutTime } = generateLoginTimes();
                loginData.push({
                    userId: user.id,
                    loginTime: loginTime,
                    logoutTime: logoutTime
                });
            }
        }
        
        const logs = await Logs.bulkCreate(loginData);
        console.log(`Successfully created ${logs.length} login records!`);
        
        return { users, logs };
    } catch (error) {
        console.log("Error creating users/logins:", error);
        throw error;
    }
}

async function main() {
    await create_tables(); // Create tables first
    await loadRandomData(); // Load 15 random users
    await close_db();
}

main();

