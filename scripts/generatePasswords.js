// scripts/generatePasswords.js
const bcrypt = require('bcryptjs');

const generateHash = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Password: ${password} -> Hash: ${hash}`);
};

generateHash('admin123');    // Para admin@system.com
generateHash('employee123'); // Para employee@system.com  
generateHash('ronnie123');   // Para ronnie@gmail.com