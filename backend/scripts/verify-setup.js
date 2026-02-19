#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to check if your MeetingAI setup is correct
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message) {
  console.log(message);
}

function success(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function error(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function info(message) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${message}`);
}

function header(title) {
  console.log(`\n${colors.blue}${title}${colors.reset}\n`);
}

// Start verification
header('🔍 MeetingAI Setup Verification\n');

let allGood = true;

// 1. Check Node.js version
header('1. Node.js & npm');
const nodeVersion = process.version;
const nodeMatch = nodeVersion.match(/v(\d+)/);
const nodeMajor = parseInt(nodeMatch[1]);

if (nodeMajor >= 18) {
  success(`Node.js: ${nodeVersion}`);
} else {
  error(`Node.js: ${nodeVersion} (need v18+)`);
  allGood = false;
}

// Check npm version
const execSync = require('child_process').execSync;
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  const npmMatch = npmVersion.match(/(\d+)/);
  const npmMajor = parseInt(npmMatch[1]);
  
  if (npmMajor >= 8) {
    success(`npm: ${npmVersion}`);
  } else {
    error(`npm: ${npmVersion} (need v8+)`);
    allGood = false;
  }
} catch (e) {
  error('Could not check npm version');
  allGood = false;
}

// 2. Check .env file
header('2. Configuration Files');

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (fs.existsSync(envPath)) {
  success('.env file exists');
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Check required variables
  const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT',
  ];
  
  const missingVars = [];
  const emptyVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    } else {
      const regex = new RegExp(`${varName}=(.*)$`, 'm');
      const match = envContent.match(regex);
      if (match && (!match[1] || match[1].trim() === '')) {
        emptyVars.push(varName);
      }
    }
  });
  
  if (missingVars.length === 0 && emptyVars.length === 0) {
    success('All required variables present');
  } else {
    if (missingVars.length > 0) {
      error(`Missing variables: ${missingVars.join(', ')}`);
      allGood = false;
    }
    if (emptyVars.length > 0) {
      warning(`Empty variables: ${emptyVars.join(', ')}`);
    }
  }
  
  // Check optional but important
  const optionalVars = ['CLAUDE_API_KEY', 'OPENAI_API_KEY'];
  const hasAnyAI = optionalVars.some(v => {
    const regex = new RegExp(`${v}=(.+)$`, 'm');
    const match = envContent.match(regex);
    return match && match[1].trim() && match[1].trim() !== 'sk-ant-your-key-here';
  });
  
  if (!hasAnyAI) {
    warning('No AI API keys configured (Claude or OpenAI)');
    info('  → App will use regex-based parser for AI analysis');
  } else {
    success('AI API keys configured');
  }
} else {
  error('.env file NOT found');
  if (fs.existsSync(envExamplePath)) {
    info('  → Run: cp .env.example .env');
  }
  allGood = false;
}

// 3. Check node_modules
header('3. Dependencies');

const nodeModulesPath = path.join(__dirname, '../node_modules');
const packageJsonPath = path.join(__dirname, '../package.json');

if (fs.existsSync(nodeModulesPath)) {
  success('node_modules exists');
} else {
  error('node_modules NOT found');
  info('  → Run: npm install');
  allGood = false;
}

// Check key packages
if (fs.existsSync(packageJsonPath)) {
  const packageJson = require(packageJsonPath);
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const keyPackages = [
    'express',
    'mongoose',
    'cors',
    'dotenv',
    'jsonwebtoken',
    'bcryptjs',
  ];
  
  const missingPackages = keyPackages.filter(pkg => !deps[pkg]);
  
  if (missingPackages.length === 0) {
    success('All key packages are listed in package.json');
  } else {
    warning(`Missing packages: ${missingPackages.join(', ')}`);
    info('  → Run: npm install');
  }
}

// 4. Database connection test (optional)
header('4. Database');

const envContent = fs.existsSync(envPath) 
  ? fs.readFileSync(envPath, 'utf-8') 
  : '';

const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
if (mongoMatch && mongoMatch[1]) {
  const mongoUri = mongoMatch[1].trim();
  if (mongoUri.includes('mongodb+srv')) {
    info('Using MongoDB Atlas (cloud)');
  } else if (mongoUri.includes('localhost')) {
    info('Using local MongoDB');
    warning('Make sure mongod is running locally');
  } else {
    warning(`Unknown MongoDB URI: ${mongoUri.substring(0, 50)}...`);
  }
  success('MONGODB_URI configured');
} else {
  error('MONGODB_URI not configured');
  allGood = false;
}

// 5. Check scripts in package.json
header('5. npm Scripts');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = require(packageJsonPath);
  const scripts = packageJson.scripts || {};
  
  const expectedScripts = ['dev', 'start', 'test'];
  const foundScripts = expectedScripts.filter(script => scripts[script]);
  const missingScripts = expectedScripts.filter(script => !scripts[script]);
  
  if (foundScripts.length > 0) {
    foundScripts.forEach(script => {
      success(`npm run ${script} is available`);
    });
  }
  
  if (missingScripts.length > 0) {
    warning(`Missing scripts: ${missingScripts.join(', ')}`);
  }
}

// 6. Check important files
header('6. Project Structure');

const importantFiles = [
  'src/server.js',
  'src/config/env.js',
  'src/models/User.js',
  'src/models/Meeting.js',
  'package.json',
];

const baseDir = path.join(__dirname, '..');
let filesOk = true;

importantFiles.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    success(`${file}`);
  } else {
    error(`${file} (NOT FOUND)`);
    filesOk = false;
  }
});

// 7. Summary
header('7. Summary');

if (allGood && filesOk) {
  console.log(`\n${colors.green}✅ Setup looks good!${colors.reset}`);
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log('  1. Start backend: npm run dev');
  console.log('  2. In new terminal, start frontend: cd ../frontend && npm start');
  console.log('  3. Open http://localhost:3001 in browser');
  console.log(`\n`);
  process.exit(0);
} else {
  console.log(`\n${colors.red}❌ Setup has issues${colors.reset}`);
  console.log(`\n${colors.cyan}Common fixes:${colors.reset}`);
  console.log('  • npm install');
  console.log('  • cp .env.example .env (then edit .env)');
  console.log('  • Start MongoDB (local or Atlas)');
  console.log('  • Check all required env variables');
  console.log(`\n`);
  process.exit(1);
}
