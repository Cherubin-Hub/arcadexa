// npx tsx generate_hash.ts

import sql from 'mssql';
import bcrypt from 'bcrypt';

const config = {
  user: 'sa',
  password: 'masterkey_2233', // Your DB password
  server: 'localhost',
  database: 'arcadexa',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

(async () => {
  try {
    await sql.connect(config);
    const hash = await bcrypt.hash('admin', 10); // Password is 'admin'
    
    await sql.query(`
      INSERT INTO tblUsers (Username, PasswordHash, Email, FirstName, LastName) 
      VALUES ('admin', '${hash}', 'admin@arcadexa.com', 'Admin', 'Admin')
    `);
    
    console.log('✅ User successfully inserted!');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit();
  }
})();
