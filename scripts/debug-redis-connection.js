// Debug Redis Connection for Railway
const { spawn } = require('child_process');

console.log('🔍 Railway Redis Connection Debug Script');
console.log('=========================================\n');

// Function to run railway command and capture output
function runRailwayCommand(args) {
    return new Promise((resolve, reject) => {
        const railway = spawn('railway', args, { stdio: 'pipe' });
        let output = '';
        let error = '';

        railway.stdout.on('data', (data) => {
            output += data.toString();
        });

        railway.stderr.on('data', (data) => {
            error += data.toString();
        });

        railway.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(error);
            }
        });
    });
}

async function debugRedisConnection() {
    try {
        console.log('1. Checking Railway services...');
        const services = await runRailwayCommand(['service']);
        console.log('Services found:');
        console.log(services);
        console.log('---\n');

        console.log('2. Checking current environment variables for backend...');
        try {
            const envVars = await runRailwayCommand(['variables']);
            console.log('Environment Variables:');
            console.log(envVars);
            
            // Look for Redis URL pattern
            if (envVars.includes('REDIS_URL')) {
                console.log('✅ REDIS_URL is set');
                const redisLine = envVars.split('\n').find(line => line.includes('REDIS_URL'));
                if (redisLine) {
                    console.log('Current REDIS_URL value:', redisLine);
                    if (redisLine.includes('redis-g6xi.railway.internal')) {
                        console.log('❌ PROBLEM: Still using old Redis hostname!');
                        console.log('   This hostname is no longer valid.');
                    }
                }
            } else {
                console.log('❌ REDIS_URL is NOT set');
            }
        } catch (error) {
            console.log('Could not fetch environment variables:', error.message);
        }

        console.log('\n3. Next steps to fix:');
        console.log('=====================');
        console.log('A. Go to your Railway dashboard');
        console.log('B. Find your Redis service (should show as active)');
        console.log('C. Go to Redis service → Variables tab');
        console.log('D. Copy the EXACT value of REDIS_URL');
        console.log('E. Go to Backend service → Variables tab');
        console.log('F. Update REDIS_URL with the new value');
        console.log('G. Make sure PORT=9000 is also set');
        console.log('H. Redeploy the backend service');

        console.log('\n4. The REDIS_URL should look like:');
        console.log('redis://default:[password]@[new-hostname]:6379');
        console.log('NOT: redis-g6xi.railway.internal (this is old)');

    } catch (error) {
        console.log('Error running Railway CLI:', error.message);
        console.log('\n💡 Make sure you have Railway CLI installed:');
        console.log('npm install -g @railway/cli');
        console.log('railway login');
        console.log('railway link (to connect to your project)');
    }
}

debugRedisConnection();
