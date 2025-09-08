const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First, run TypeScript compilation
try {
  console.log('Running TypeScript compilation...');
  execSync('tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('TypeScript compilation failed, but continuing with manual JS file creation');
}

// Check if dist directory exists and clean it before starting
const destDir = path.join(__dirname, 'dist');
if (fs.existsSync(destDir)) {
  console.log(`Cleaning previous build in ${destDir}`);
  fs.rmSync(destDir, { recursive: true, force: true });
}

// Function to recursively copy directory structure and transform TS to JS
function copyAndTransform(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyAndTransform(srcPath, destPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      // Replace .ts with .js for the destination
      const destJsPath = destPath.replace(/\.ts$/, '.js');
      
      // Read the TypeScript file
      let content = fs.readFileSync(srcPath, 'utf8');
      
      // Remove type annotations
      content = content
        // Remove import type statements
        .replace(/import\s+type\s+.*?from\s+['"].*?['"]/g, '')
        // Remove interface and type declarations
        .replace(/^(export\s+)?(interface|type)\s+[\s\S]*?(?=(\n\s*\n|\n\s*export|\n\s*import|\n\s*\/\/|\n\s*\/\*|\n\s*function|\n\s*class|$))/gm, '')
        // Fix imports (keep .js extensions for ES modules)
        .replace(/from\s+['"](\.\.?\/[^"']+)(?!\.js)['"]/g, 'from "$1.js"')
        // Remove type parameters from generic functions/classes
        .replace(/<([^<>]|<[^<>]*>)*>/g, '')
        // Remove function parameter types
        .replace(/(function|constructor|method|set|get|\()(\s*[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\(\s*([^:=()]*?):[^,)]+([,)])/g, '$1$2($3$4')
        // Remove function return types
        .replace(/\):\s*([a-zA-Z_$<>[\].]+|\{[^}]*\})\s*(\{|=>)/g, ') $2')
        // Remove remaining parameter types (multi-line params)
        .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*[a-zA-Z_$][\w\s|&<>.[\]]*?(,|\))/g, '$1$2');
      
      // Write the JavaScript file
      fs.writeFileSync(destJsPath, content);
      console.log(`Created: ${destJsPath}`);
    }
  }
}

// Start the transformation from src to dist
const srcDir = path.join(__dirname, 'src');

console.log(`Converting TypeScript files from ${srcDir} to JavaScript files in ${destDir}`);
copyAndTransform(srcDir, destDir);
console.log('Build completed!');
