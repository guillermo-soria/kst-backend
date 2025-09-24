#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating Production Secrets for Railway\n');

// Generate secure random strings
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const jwtSecret = generateSecret(32);
const cookieSecret = generateSecret(32);

console.log('✅ Copy these to Railway Environment Variables:\n');
console.log('━'.repeat(60));
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`COOKIE_SECRET=${cookieSecret}`);
console.log('━'.repeat(60));

console.log('\n📋 Additional Production Variables:');
console.log('━'.repeat(60));
console.log('NODE_ENV=production');
console.log('MEDUSA_WORKER_MODE=shared');
console.log('DISABLE_MEDUSA_ADMIN=false');
console.log('PORT=$PORT');
console.log('DATABASE_URL=${{Postgres.DATABASE_URL}}');
console.log('━'.repeat(60));

console.log('\n🌐 CORS Configuration (update domains when ready):');
console.log('━'.repeat(60));
console.log('STORE_CORS=http://localhost:3000');
console.log('ADMIN_CORS=${{RAILWAY_STATIC_URL}}');
console.log('AUTH_CORS=${{RAILWAY_STATIC_URL}}');
console.log('━'.repeat(60));

console.log('\n⚠️  Important Security Notes:');
console.log('• Never commit these secrets to git');
console.log('• Keep JWT_SECRET and COOKIE_SECRET private'); 
console.log('• Update CORS URLs with your actual domains');
console.log('• Consider adding Redis for better performance');

console.log('\n🚀 Ready for Railway deployment!');
