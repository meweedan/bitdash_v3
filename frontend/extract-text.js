#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs methods to promise-based versions
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Regex patterns to find text in different React components and JSX elements
const patterns = [
  // Match text in <Text> tags
  /<Text[^>]*>([^<]+)<\/Text>/g,
  
  // Match text in <Button> tags
  /<Button[^>]*>([^<]+)<\/Button>/g,
  
  // Match text in <Heading> tags
  /<Heading[^>]*>([^<]+)<\/Heading>/g,
  
  // Match text in label prop of various components
  /label=["']([^"']+)["']/g,
  
  // Match text in title prop of various components
  /title=["']([^"']+)["']/g,
  
  // Match text in placeholder prop
  /placeholder=["']([^"']+)["']/g,
  
  // Match text in error message props
  /errorMessage=["']([^"']+)["']/g,
  
  // Match text in alt tags for images
  /alt=["']([^"']+)["']/g,
  
  // Match string literals assigned to variables
  /const\s+\w+\s*=\s*["']([^"']+)["']/g,
  
  // Match hardcoded strings in JSX
  />\s*([A-Za-z][\w\s.,!?:;-]+)\s*</g
];

// Extensions to scan
const extensions = ['.js', '.jsx', '.tsx', '.ts'];

// Function to check if a file should be processed
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return extensions.includes(ext);
};

// Function to recursively scan directories
async function scanDirectory(dirPath, results = {}) {
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      // Skip node_modules and hidden directories
      if (entry === 'node_modules' || entry.startsWith('.')) {
        continue;
      }
      
      const entryPath = path.join(dirPath, entry);
      const entryStat = await stat(entryPath);
      
      if (entryStat.isDirectory()) {
        // Recursively scan subdirectories
        await scanDirectory(entryPath, results);
      } else if (entryStat.isFile() && shouldProcessFile(entryPath)) {
        // Process file if it matches our criteria
        const fileContent = await readFile(entryPath, 'utf8');
        const matches = extractTextFromFile(fileContent);
        
        if (matches.length > 0) {
          results[entryPath] = matches;
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return results;
}

// Function to extract text from a file using the regex patterns
function extractTextFromFile(content) {
  const matches = [];
  
  for (const pattern of patterns) {
    let match;
    // Reset the lastIndex to ensure we search from the beginning
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      // Get the captured group (the text)
      const text = match[1].trim();
      
      // Skip empty strings, single letters, or non-English text
      if (
        text && 
        text.length > 1 && 
        /[a-zA-Z]/.test(text) && // Contains at least one English letter
        !/^[0-9\s.,;:!?()[\]{}+-=*/&|<>]+$/.test(text) // Not just numbers and punctuation
      ) {
        matches.push(text);
      }
    }
  }
  
  return [...new Set(matches)]; // Remove duplicates
}

// Main function
async function main() {
  try {
    // Get directory from command line args or use current directory
    const targetDir = process.argv[2] || process.cwd();
    
    console.log(`Scanning directory: ${targetDir}`);
    
    // Scan directory and get results
    const results = await scanDirectory(targetDir);
    
    // Create a formatted JSON with file paths and text
    const outputPath = path.join(process.cwd(), 'extracted-text.json');
    await writeFile(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`Found hardcoded text in ${Object.keys(results).length} files`);
    console.log(`Results saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();