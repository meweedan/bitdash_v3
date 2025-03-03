#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs methods to promise-based versions
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Extensions to scan - adjust as needed for your project
const extensions = ['.js', '.jsx', '.tsx', '.ts'];

// Regex pattern to match {t('text')} translation keys
// This matches both {t('text')} and {t("text")} formats
const translationKeyPattern = /\{t\(['"]([^'"]+)['"]\)\}/g;

// Function to check if a file should be processed
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return extensions.includes(ext);
};

// Function to recursively scan directories
async function scanDirectory(dirPath, translationKeys = {}) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      // Skip node_modules and hidden directories
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }
      
      const entryPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await scanDirectory(entryPath, translationKeys);
      } else if (entry.isFile() && shouldProcessFile(entryPath)) {
        // Process file if it matches our criteria
        const fileContent = await readFile(entryPath, 'utf8');
        const keysInFile = extractTranslationKeys(fileContent);
        
        if (keysInFile.length > 0) {
          const relativePath = path.relative(process.cwd(), entryPath);
          translationKeys[relativePath] = keysInFile;
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return translationKeys;
}

// Function to extract translation keys from a file using the regex pattern
function extractTranslationKeys(content) {
  const keys = new Set();
  let match;
  
  while ((match = translationKeyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys).sort();
}

// Function to generate a flat structure of all unique translation keys
function generateFlatTranslationStructure(translationKeysByFile) {
  const allKeys = new Set();
  
  // Collect all unique keys
  Object.values(translationKeysByFile).forEach(keys => {
    keys.forEach(key => allKeys.add(key));
  });
  
  // Convert to a sorted array
  return Array.from(allKeys).sort();
}

// Main function
async function main() {
  try {
    // Get directory from command line args or use current directory
    const targetDir = process.argv[2] || process.cwd();
    
    console.log(`Scanning directory: ${targetDir}`);
    
    // Scan directory and get keys grouped by file
    const keysByFile = await scanDirectory(targetDir);
    
    // Generate a flat structure with all unique keys
    const allUniqueKeys = generateFlatTranslationStructure(keysByFile);
    
    // Create a JSON object with all keys set to empty strings (for translation)
    const translationTemplate = {};
    allUniqueKeys.forEach(key => {
      translationTemplate[key] = "";
    });
    
    // Output files path
    const byFileOutputPath = path.join(process.cwd(), 'translation-keys-by-file.json');
    const flatOutputPath = path.join(process.cwd(), 'translation-keys.json');
    
    // Write the results to JSON files
    await writeFile(byFileOutputPath, JSON.stringify(keysByFile, null, 2));
    await writeFile(flatOutputPath, JSON.stringify(translationTemplate, null, 2));
    
    const totalFiles = Object.keys(keysByFile).length;
    const totalKeys = allUniqueKeys.length;
    
    console.log(`Found ${totalKeys} unique translation keys in ${totalFiles} files`);
    console.log(`Results saved to:`);
    console.log(`  - ${byFileOutputPath} (keys grouped by file)`);
    console.log(`  - ${flatOutputPath} (flat structure for translation)`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();