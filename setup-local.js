#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output (cross-platform)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    log(`❌ Command failed: ${command}`, colors.red);
    process.exit(1);
  }
}

function copyEnvFile(examplePath, targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      log(`⚠️  ${targetPath} already exists, skipping...`, colors.yellow);
      return false;
    }
    fs.copyFileSync(examplePath, targetPath);
    log(`✅ Created ${targetPath} from ${examplePath}`, colors.green);
    return true;
  } catch (error) {
    log(`❌ Failed to copy ${examplePath} to ${targetPath}`, colors.red);
    throw error;
  }
}

async function main() {
  log('\n🚀 Setting up Flowvera local environment...\n', colors.cyan);

  // Check Node.js version
  const nodeVersion = process.version;
  log(`✅ Node.js version: ${nodeVersion}`, colors.green);
  console.log();

  // Install dependencies
  log('📦 Installing dependencies...', colors.cyan);
  exec('npm run install:all');
  log('✅ Dependencies installed', colors.green);
  console.log();

  // Setup Frontend .env
  log('🔧 Setting up Frontend environment...', colors.cyan);
  const frontendEnvExample = path.join(__dirname, 'frontend', '.env.example');
  const frontendEnv = path.join(__dirname, 'frontend', '.env');
  copyEnvFile(frontendEnvExample, frontendEnv);

  // Setup Backend .env
  log('🔧 Setting up Backend environment...', colors.cyan);
  const backendEnvExample = path.join(__dirname, 'backend', '.env.example');
  const backendEnv = path.join(__dirname, 'backend', '.env');
  copyEnvFile(backendEnvExample, backendEnv);

  // Success message
  console.log();
  log('✨ Local setup complete!', colors.bright + colors.green);
  console.log();
  log('📝 Next steps:', colors.cyan);
  console.log('   1. Review and customize backend/.env if needed');
  console.log('   2. Review and customize frontend/.env if needed');
  console.log('   3. Run \'npm run dev\' to start the development servers');
  console.log();
  log('🌐 The application will be available at:', colors.cyan);
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend:  http://localhost:3001');
  console.log();
  log('📚 For more information, see:', colors.cyan);
  console.log('   - README.md for general documentation');
  console.log('   - ONBOARDING.md for user onboarding guide');
  console.log('   - CONTRIBUTING.md for contribution guidelines');
  console.log();
}

main().catch(error => {
  log(`\n❌ Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});
