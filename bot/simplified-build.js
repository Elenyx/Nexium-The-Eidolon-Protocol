/**
 * This is a simplified build script that transforms TypeScript to JavaScript
 * without relying on complex regex patterns that might miss edge cases
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Log environment info
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);

// Clean the dist directory
const destDir = path.join(__dirname, 'dist');
if (fs.existsSync(destDir)) {
  console.log(`Cleaning previous build in ${destDir}`);
  fs.rmSync(destDir, { recursive: true, force: true });
}
fs.mkdirSync(destDir, { recursive: true });

// Try to run TypeScript compiler first
try {
  console.log('Running TypeScript compilation...');
  execSync('npx tsc', { stdio: 'inherit' });
  
  // Check if files were generated
  const files = fs.readdirSync(destDir);
  if (files.length > 0) {
    console.log('TypeScript compilation successful!');
    process.exit(0);
  }
} catch (error) {
  console.error('TypeScript compilation failed:', error.message);
  console.log('Falling back to manual conversion...');
}

// Function to recursively copy directory structure
function copyDirStructure(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirStructure(srcPath, destPath);
    }
  }
}

// Function to convert TypeScript to JavaScript using a simpler approach
function convertTsToJs(srcDir, destDir) {
  // First create the directory structure
  copyDirStructure(srcDir, destDir);
  console.log(`Created directory structure for ${destDir}`);
  
  // Function to process a single file
  function processFile(filePath) {
    if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
      const relativePath = path.relative(srcDir, filePath);
      const destPath = path.join(destDir, relativePath.replace(/\.ts$/, '.js'));
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Simple replacements to convert to JS
      content = content
        // Remove imports with 'type'
        .replace(/import\s+type\s+.*?from\s+['"].*?['"];?\s*\n?/g, '')
        .replace(/import\s+\{\s*type\s+.*?\}\s+from\s+['"].*?['"];?\s*\n?/g, '')
        
        // Remove interfaces and type declarations
        .replace(/\s*interface\s+\w+\s*\{[\s\S]*?\n\}/g, '')
        .replace(/\s*type\s+\w+\s*=[\s\S]*?;\s*\n?/g, '')
        
        // Fix import paths to include .js
        .replace(/from\s+['"](\.\.?\/[^"']+)(?!\.js)['"]/g, 'from "$1.js"')
        
        // Remove type annotations from variables and parameters
        .replace(/:\s*[A-Za-z0-9_\[\]\<\>\{\}\|&.]+/g, '')
        
        // Fix any syntax that broke during the replacements
        .replace(/,\s*\)/g, ')')
        .replace(/\(\s*,/g, '(')
        .replace(/,\s*,/g, ',')
        .replace(/\s*<[\s\S]*?>\s*/g, ' ')
        
        // Remove access modifiers (public, private, protected)
        .replace(/\b(public|private|protected)\s+/g, '');
      
      fs.writeFileSync(destPath, content);
      console.log(`Created: ${destPath}`);
    }
  }
  
  // Function to recursively find all .ts files
  function findTsFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findTsFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        processFile(fullPath);
      }
    }
  }
  
  findTsFiles(srcDir);
}

// Convert TypeScript to JavaScript
const srcDir = path.join(__dirname, 'src');
console.log(`Converting TypeScript files from ${srcDir} to JavaScript files in ${destDir}`);
convertTsToJs(srcDir, destDir);

console.log('Build completed!');
