const fs = require('fs');
const path = require('path');

// Run after npm install to fix dependencies
console.log('Running postinstall script to fix dependencies...');

// Ensure ajv package is properly installed
try {
  // Path to check if the module exists
  const ajvPath = path.join(process.cwd(), 'node_modules', 'ajv', 'dist', 'compile', 'codegen.js');
  
  if (!fs.existsSync(ajvPath)) {
    console.log('Missing ajv/dist/compile/codegen - installing ajv@8.12.0');
    require('child_process').execSync('npm install ajv@8.12.0 --legacy-peer-deps --no-save', {
      stdio: 'inherit'
    });
  } else {
    console.log('ajv codegen module exists.');
  }
  
  // Also ensure ajv-keywords is compatible
  console.log('Installing ajv-keywords@5.1.0 for compatibility');
  require('child_process').execSync('npm install ajv-keywords@5.1.0 --legacy-peer-deps --no-save', {
    stdio: 'inherit'
  });
  
} catch (error) {
  console.error('Error in postinstall script:', error);
  process.exit(1);
}

console.log('Postinstall script completed.');
