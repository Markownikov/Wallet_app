const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run after npm install to fix dependencies
console.log('Running postinstall script to fix dependencies...');

// Ensure ajv and related packages are properly installed
try {
  console.log('Installing and linking required dependency versions...');
  
  // Force install compatible versions
  execSync('npm install ajv@8.12.0 --legacy-peer-deps --no-save', {
    stdio: 'inherit'
  });
  
  execSync('npm install ajv-keywords@5.1.0 --legacy-peer-deps --no-save', {
    stdio: 'inherit'
  });
  
  execSync('npm install schema-utils@4.2.0 --legacy-peer-deps --no-save', {
    stdio: 'inherit'
  });
  
  // Check if codegen.js exists after installation
  const ajvPath = path.join(process.cwd(), 'node_modules', 'ajv', 'dist', 'compile', 'codegen.js');
  
  if (fs.existsSync(ajvPath)) {
    console.log('ajv/dist/compile/codegen.js verified - installation successful');
  } else {
    console.error('ERROR: ajv/dist/compile/codegen.js still missing after installation');
    // Create the directory structure if it doesn't exist
    const dirPath = path.dirname(ajvPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
} catch (error) {
  console.error('Error in postinstall script:', error);
  process.exit(1);
}

console.log('Postinstall script completed.');
