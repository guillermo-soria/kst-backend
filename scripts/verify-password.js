const bcrypt = require('bcrypt');

async function verifyPassword() {
  const plainPassword = 'supersecret';
  const hashedFromDB = '$2b$12$nGBtdKUCFc7Q4iPekP6dyeEAMs1APPwkf4CW6GCzMzJLtC625b.mm';
  
  console.log('Verifying password...');
  console.log('Plain password:', plainPassword);
  console.log('Hash from DB:', hashedFromDB);
  
  const isValid = await bcrypt.compare(plainPassword, hashedFromDB);
  console.log('Password match:', isValid);
  
  if (!isValid) {
    console.log('\nTrying alternative passwords...');
    
    const alternatives = ['admin', 'password', '123456', 'admin123', 'test'];
    
    for (const alt of alternatives) {
      const altValid = await bcrypt.compare(alt, hashedFromDB);
      console.log(`Password "${alt}" match:`, altValid);
    }
    
    console.log('\nGenerating new hash for "supersecret":');
    const newHash = await bcrypt.hash(plainPassword, 12);
    console.log('New hash:', newHash);
  }
}

verifyPassword().catch(console.error);
