const fs = require('fs');
const path = require('path');

// Patterns that indicate code rather than UI text
const CODE_PATTERNS = [
  /\${.*?}/,                    // Template literals
  /\.[a-zA-Z]+\(/,             // Method calls
  /\battributes\b/,            // Attributes keyword
  /\bdata\b/,                  // Data keyword
  /\bmap\s*\(/,                // Map functions
  /=>/,                        // Arrow functions
  /\?/,                        // Ternary operators
  /\./,                        // Object access
  /\[.*?\]/,                   // Array access
  /\(.*?\)/,                   // Function calls
  /^[a-z0-9_]+$/i,            // Single word variables
  /\b(true|false|null|undefined)\b/i, // JavaScript literals
  /\b(var|let|const)\b/,      // Variable declarations
  /\b(if|else|return|case)\b/, // JavaScript keywords
  /^\d+$/,                     // Numbers only
  /\b(px|em|rem|vh|vw)\b/,    // CSS units
  /\b(flex|grid|block)\b/,     // CSS display values
  /^[<>\/].*$/,               // HTML-like content
];

// Common programming terms to ignore
const IGNORE_TERMS = new Set([
  'div', 'span', 'component', 'container', 'wrapper', 'layout',
  'button', 'input', 'form', 'label', 'text', 'image', 'icon',
  'header', 'footer', 'nav', 'main', 'section', 'article',
  'flex', 'grid', 'block', 'inline', 'hidden', 'visible',
  'default', 'primary', 'secondary', 'success', 'error', 'warning',
  'small', 'medium', 'large', 'content', 'data', 'item', 'items',
  'active', 'disabled', 'loading', 'selected', 'current', 'parent',
  'child', 'children', 'sibling', 'target', 'source', 'value',
  'key', 'ref', 'props', 'state', 'context', 'theme', 'style'
]);

function isCodeOrVariable(text) {
  // Check if text matches any code patterns
  if (CODE_PATTERNS.some(pattern => pattern.test(text))) {
    return true;
  }

  // Check if text is a common programming term
  if (IGNORE_TERMS.has(text.toLowerCase())) {
    return true;
  }

  return false;
}

function isTranslatableText(text) {
  // Remove whitespace
  text = text.trim();

  // Skip if empty or too short
  if (!text || text.length < 2) return false;

  // Skip if looks like code
  if (isCodeOrVariable(text)) return false;

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(text)) return false;

  // Should look like a proper phrase or word
  return /^[A-Za-z0-9\s.,!?&'"\-()]+$/.test(text);
}

function generateTranslationKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 30);
}

function processFiles(sourceDir, commonJson) {
  const translations = { ...commonJson };
  const newTranslations = {};
  let addedCount = 0;
  let skippedCount = 0;

  // Add getStaticProps template
  const staticPropsTemplate = `
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}`;

  function traverse(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        traverse(fullPath);
        continue;
      }

      if (!['.js', '.jsx', '.tsx'].includes(path.extname(file))) {
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Extract text within JSX
      const jsxTexts = content.match(/>([^<]+)</g) || [];
      
      jsxTexts.forEach(match => {
        const text = match.slice(1, -1).trim();
        
        if (isTranslatableText(text)) {
          const key = generateTranslationKey(text);
          
          if (translations[key]) {
            skippedCount++;
            return;
          }

          newTranslations[key] = text;
          addedCount++;
        }
      });

      // Extract string literals that look like UI text
      const stringLiterals = content.match(/"([^"]+)"|'([^']+)'/g) || [];
      
      stringLiterals.forEach(match => {
        const text = match.slice(1, -1).trim();
        
        if (isTranslatableText(text)) {
          const key = generateTranslationKey(text);
          
          if (translations[key]) {
            skippedCount++;
            return;
          }

          newTranslations[key] = text;
          addedCount++;
        }
      });
    }
  }

  traverse(sourceDir);

  // Merge translations
  Object.assign(translations, newTranslations);

  // Sort keys alphabetically
  const sortedTranslations = {};
  Object.keys(translations).sort().forEach(key => {
    sortedTranslations[key] = translations[key];
  });

  return {
    translations: sortedTranslations,
    addedCount,
    skippedCount,
    staticPropsTemplate
  };
}

// Main execution
const sourceDir = './src';  // Change this to your source directory
const commonJsonPath = './public/locales/en/common.json';

try {
  const commonJson = JSON.parse(fs.readFileSync(commonJsonPath, 'utf8'));
  const { translations, addedCount, skippedCount, staticPropsTemplate } = processFiles(sourceDir, commonJson);

  // Write updated translations
  fs.writeFileSync(
    commonJsonPath,
    JSON.stringify(translations, null, 2),
    'utf8'
  );

  // Create/update a helper file with getStaticProps
  fs.writeFileSync(
    './src/utils/i18n-helper.js',
    staticPropsTemplate,
    'utf8'
  );

  console.log('\nTranslation scan complete!');
  console.log(`Added ${addedCount} new translations`);
  console.log(`Skipped ${skippedCount} existing translations`);
  console.log('\ngetStaticProps template added to src/utils/i18n-helper.js');

} catch (error) {
  console.error('Error processing translations:', error);
}