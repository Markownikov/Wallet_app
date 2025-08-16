// fix-ajv.js
const fs = require('fs');
const path = require('path');

const codegenPath = path.join(process.cwd(), 'node_modules', 'ajv', 'dist', 'compile', 'codegen.js');
const codegenDir = path.dirname(codegenPath);

// Create directories if they don't exist
if (!fs.existsSync(codegenDir)) {
  console.log('Creating directory structure for ajv/dist/compile...');
  fs.mkdirSync(codegenDir, { recursive: true });
}

// Create a minimal codegen.js if it doesn't exist
if (!fs.existsSync(codegenPath)) {
  console.log('Creating placeholder codegen.js...');
  const placeholderContent = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._ = exports.nil = exports.Name = exports.CodeGen = void 0;
class CodeGen {
  constructor() {}
  toString() { return ""; }
}
exports.CodeGen = CodeGen;
class Name {
  constructor() {}
  toString() { return ""; }
}
exports.Name = Name;
exports.nil = {};
exports._ = {};
`;
  fs.writeFileSync(codegenPath, placeholderContent);
  console.log('Created placeholder codegen.js');
}

console.log('fix-ajv.js completed');
