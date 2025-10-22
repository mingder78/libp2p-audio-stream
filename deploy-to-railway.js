#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Automated Railway Deployment for Treehole P2P Relay');
console.log('=' .repeat(60));

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Not in a git repository. Please run: git init');
  process.exit(1);
}

// Check if railway.toml exists
if (!fs.existsSync('railway.toml')) {
  console.error('❌ railway.toml not found. Please ensure it exists.');
  process.exit(1);
}

// Step 1: Commit current changes
console.log('📦 Step 1: Committing current changes...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Deploy relay to Railway" || true', { stdio: 'inherit' });
  console.log('✅ Changes committed');
} catch (error) {
  console.log('ℹ️ No changes to commit');
}

// Step 2: Check if Railway CLI is installed
console.log('🔧 Step 2: Checking Railway CLI...');
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI found');
} catch (error) {
  console.log('📥 Installing Railway CLI...');
  try {
    execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    console.log('✅ Railway CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Railway CLI');
    console.error('Please install manually: npm install -g @railway/cli');
    process.exit(1);
  }
}

// Step 3: Login to Railway
console.log('🔐 Step 3: Railway login...');
try {
  execSync('railway login', { stdio: 'inherit' });
  console.log('✅ Logged into Railway');
} catch (error) {
  console.error('❌ Railway login failed');
  process.exit(1);
}

// Step 4: Initialize Railway project (if not exists)
console.log('🏗️ Step 4: Initializing Railway project...');
try {
  execSync('railway init', { stdio: 'inherit' });
  console.log('✅ Railway project initialized');
} catch (error) {
  console.log('ℹ️ Railway project already exists or initialization skipped');
}

// Step 5: Set environment variables
console.log('⚙️ Step 5: Setting environment variables...');
const envVars = [
  'NODE_ENV=production',
  'PORT=9001',
  'WS_PORT=9002',
  'HEALTH_PORT=3000'
];

envVars.forEach(envVar => {
  try {
    execSync(`railway variables set ${envVar}`, { stdio: 'inherit' });
    console.log(`✅ Set ${envVar}`);
  } catch (error) {
    console.warn(`⚠️ Failed to set ${envVar}`);
  }
});

// Step 6: Deploy to Railway
console.log('🚀 Step 6: Deploying to Railway...');
try {
  execSync('railway up', { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

// Step 7: Get deployment URL
console.log('🌐 Step 7: Getting deployment URL...');
try {
  const url = execSync('railway domain', { encoding: 'utf8' }).trim();
  console.log('=' .repeat(60));
  console.log('🎉 DEPLOYMENT SUCCESSFUL!');
  console.log('=' .repeat(60));
  console.log(`🌐 Your relay is now live at: ${url}`);
  console.log(`🏥 Health check: ${url}/health`);
  console.log('');
  console.log('📋 Next steps:');
  console.log(`1. Test health: curl ${url}/health`);
  console.log('2. Update constants.js with your relay address');
  console.log('3. Test P2P connection with your app');
  console.log('');
  console.log('🎯 Your relay peer is now running on the internet!');
  console.log('A peer → Cloud Relay → B peer architecture is ready! 🌍');
} catch (error) {
  console.log('✅ Deployment completed, but couldn\'t get URL automatically');
  console.log('Check Railway dashboard for your deployment URL');
}

console.log('=' .repeat(60));