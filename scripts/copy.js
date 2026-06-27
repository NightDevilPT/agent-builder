const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File extensions to include
const includeExtensions = ['.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.html', '.prisma', '.ts'];
// Directories to exclude
const excludeDirs = ['node_modules', 'dist', '.git', 'build', 'coverage', '.vscode'];
// Files to exclude (by exact name)
const excludeFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

/**
 * Prompt the user for input via terminal
 */
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans.trim());
  }));
}

/**
 * Get all files recursively
 */
function getAllFiles(dir, fileList = [], baseDir) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file) && !file.startsWith('.')) {
        getAllFiles(filePath, fileList, baseDir);
      }
    } else {
      if (excludeFiles.includes(file)) return;
      
      const ext = path.extname(file);
      if (includeExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

/**
 * Get folder structure as a string diagram
 */
function getFolderStructure(dir, prefix = '', structure = '') {
  if (!fs.existsSync(dir)) return structure;
  
  const files = fs.readdirSync(dir);
  const filteredFiles = files.filter(f => !excludeDirs.includes(f) && !f.startsWith('.'));
  
  filteredFiles.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isLastItem = index === filteredFiles.length - 1;
    const marker = isLastItem ? '└── ' : '├── ';
    
    if (stat.isDirectory()) {
      structure += prefix + marker + '📁 ' + file + '\n';
      const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
      structure = getFolderStructure(filePath, newPrefix, structure);
    } else {
      if (excludeFiles.includes(file)) return;
      
      const ext = path.extname(file);
      if (includeExtensions.includes(ext)) {
        structure += prefix + marker + '📄 ' + file + '\n';
      }
    }
  });
  
  return structure;
}

/**
 * Main execution block
 */
async function main() {
  // 1. Get path from arguments or ask user dynamically
  let targetInput = process.argv[2];
  
  if (!targetInput) {
    targetInput = await askQuestion('📂 Enter the absolute or relative path of the folder to scan: ');
  }

  if (!targetInput) {
    console.error('❌ Error: No path provided.');
    return;
  }

  // Resolve path safely (handles relative like './src' or absolute like '/Users/...')
  const targetRoot = path.resolve(process.cwd(), targetInput);
  const outputFile = path.join(process.cwd(), 'middleware.txt');

  console.log('\n🔍 Scanning source folder...');
  console.log(`📁 Target Location: ${targetRoot}\n`);
  
  if (!fs.existsSync(targetRoot)) {
    console.error(`❌ Source folder not found: ${targetRoot}`);
    return;
  }
  
  // 2. Scan Files
  const allFiles = getAllFiles(targetRoot, [], targetRoot);
  
  if (allFiles.length === 0) {
    console.log('❌ No matching files found.');
    return;
  }
  
  console.log(`📊 Total files found: ${allFiles.length}`);
  
  // Helper to cleanly extract display path relative to the targeted root folder
  const getDisplayPath = (filePath) => path.relative(path.dirname(targetRoot), filePath);
  const folderName = path.basename(targetRoot);

  let output = '';
  
  // Header Dumps
  output += '='.repeat(100) + '\n';
  output += '🚀 CODEBASE DUMP FILE\n';
  output += '='.repeat(100) + '\n';
  output += `📅 Generated: ${new Date().toLocaleString()}\n`;
  output += `📁 Target Directory: ${folderName}/\n`;
  output += `📊 Total Files: ${allFiles.length}\n`;
  output += '='.repeat(100) + '\n\n';
  
  // Table of Contents
  output += '📑 TABLE OF CONTENTS\n';
  output += '-'.repeat(50) + '\n';
  allFiles.sort().forEach((file, index) => {
    output += `${index + 1}. 📄 ${getDisplayPath(file)}\n`;
  });
  
  output += '\n' + '='.repeat(100) + '\n\n';
  
  // Folder Tree Structure
  output += '📁 FOLDER STRUCTURE\n';
  output += '-'.repeat(50) + '\n';
  output += `${folderName}/\n`;
  output += getFolderStructure(targetRoot, '    ');
  output += '\n' + '='.repeat(100) + '\n\n';
  
  // File Contents Section
  output += '📄 FILE CONTENTS\n';
  output += '-'.repeat(50) + '\n\n';
  
  allFiles.sort().forEach(filePath => {
    const displayPath = getDisplayPath(filePath);
    const separator = '='.repeat(100);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      output += `${separator}\n📁 FILE: ${displayPath}\n${separator}\n\n${content}\n\n`;
    } catch (error) {
      output += `${separator}\n📁 FILE: ${displayPath}\n${separator}\n\n❌ Error reading file: ${error.message}\n\n`;
    }
  });
  
  // Write result to file
  fs.writeFileSync(outputFile, output);
  
  // Summaries
  console.log(`\n✅ Code dump created successfully!`);
  console.log(`📄 Output file written to: ${outputFile}`);
  console.log(`📊 Total characters: ${output.length.toLocaleString()}`);
  console.log(`📊 Total lines: ${output.split('\n').length.toLocaleString()}`);
  
  console.log('\n📊 File Types Summary:');
  console.log('-'.repeat(50));
  const fileTypes = {};
  allFiles.forEach(file => {
    const ext = path.extname(file) || 'no extension';
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });
  Object.entries(fileTypes).sort().forEach(([ext, count]) => {
    console.log(`${ext}: ${count} files`);
  });
  
  console.log('\n📁 Folder Summary:');
  console.log('-'.repeat(50));
  const folders = {};
  allFiles.forEach(file => {
    const folder = path.dirname(path.relative(targetRoot, file));
    const label = folder === '.' ? '[root]' : folder;
    folders[label] = (folders[label] || 0) + 1;
  });
  Object.entries(folders).sort().forEach(([folder, count]) => {
    console.log(`${folder}/: ${count} files`);
  });
}

main().catch(console.error);