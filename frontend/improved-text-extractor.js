#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');

// Convert fs methods to promise-based versions
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Extensions to scan
const extensions = ['.js', '.jsx', '.tsx', '.ts'];

// Patterns to find different types of text
const patterns = {
  // Find text in React components
  jsxText: [
    /<Text[^>]*>([^<]+)<\/Text>/g,
    /<Button[^>]*>([^<]+)<\/Button>/g,
    /<Heading[^>]*>([^<]+)<\/Heading>/g,
    />\s*([A-Za-z][\w\s.,!?:;-]+)\s*</g,
  ],
  
  // Find text in object properties
  objectProperties: [
    /(?:title|name|description):\s*['"]([^'"]+)['"]/g,
  ],
  
  // Find text in t() function fallbacks
  translationFallbacks: [
    /\{t\([^)]+,\s*['"]([^'"]+)['"]\s*\)\}/g,
  ]
};

// Pattern to extract translation keys
const translationKeyPattern = /\{t\(['"]([^'"]+)['"](,\s*[^{}]+)?\)\}/g;

// Function to extract translation keys from a file
function extractTranslationKeys(content) {
  const keys = new Set();
  let match;
  
  while ((match = translationKeyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return [...keys].sort();
}

// Function to check if a file should be processed
const shouldProcessFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return extensions.includes(ext);
};

// Function to recursively scan directories
async function scanDirectory(dirPath, results = {}, translationKeys = {}) {
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
        await scanDirectory(entryPath, results, translationKeys);
      } else if (entry.isFile() && shouldProcessFile(entryPath)) {
        // Process file if it matches our criteria
        const fileContent = await readFile(entryPath, 'utf8');
        
        // Extract hardcoded text
        const extractedText = extractTextFromFile(fileContent);
        if (extractedText.length > 0) {
          const relativePath = path.relative(process.cwd(), entryPath);
          results[relativePath] = extractedText;
        }
        
        // Extract translation keys
        const keys = extractTranslationKeys(fileContent);
        if (keys.length > 0) {
          const relativePath = path.relative(process.cwd(), entryPath);
          translationKeys[relativePath] = keys;
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return { hardcodedText: results, translationKeys };
}

// Function to extract text from a file
function extractTextFromFile(content) {
  const allTexts = new Set();
  
  // Extract text using each pattern type
  for (const patternType in patterns) {
    for (const pattern of patterns[patternType]) {
      let match;
      
      while ((match = pattern.exec(content)) !== null) {
        const text = match[1].trim();
        
        // Skip empty strings, single letters, or non-English text
        if (
          text && 
          text.length > 1 && 
          /[a-zA-Z]/.test(text) && // Contains at least one English letter
          !/^[0-9\s.,;:!?()[\]{}+-=*/&|<>]+$/.test(text) && // Not just numbers and punctuation
          !text.startsWith('brand.') && // Skip theme references
          !text.startsWith('Fa') && // Skip icon references
          !text.match(/^[a-z]+$/) && // Skip single lowercase words (likely prop values)
          !['index', 'feature', 'mb', 'mt', 'as', 'mr', 'px', 'py'].includes(text.toLowerCase())
        ) {
          allTexts.add(text);
        }
      }
    }
  }
  
  return [...allTexts].sort();
}