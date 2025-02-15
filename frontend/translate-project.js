const fs = require('fs');
const path = require('path');
const translate = require('translate-google-free');

// Make sure to install required packages:
// npm install axios @babel/parser @babel/traverse @babel/generator @babel/types

const TRANSLATION_DIRS = {
  en: './public/locales/en/common.json',
  ar: './public/locales/ar/common.json'
};

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

const IGNORE_TERMS = new Set([
  'div', 'span', 'component', 'wrapper', 'layout',
  'button', 'input', 'form', 'label', 'text', 'image',
  'header', 'footer', 'nav', 'main', 'section',
  'flex', 'grid', 'block', 'inline', 'hidden',
  'default', 'primary', 'secondary', 'success', 'error',
  'small', 'medium', 'large', 'content', 'data', 'item',
  'active', 'disabled', 'loading', 'selected', 'current',
  'key', 'ref', 'props', 'state', 'context', 'theme'
]);

function isTranslatableText(text) {
  // Remove whitespace
  text = text.trim();

  // Skip if empty or too short
  if (!text || text.length < 2) return false;

  // Skip if looks like code
  if (CODE_PATTERNS.some(pattern => pattern.test(text))) return false;

  // Skip if common programming term
  if (IGNORE_TERMS.has(text.toLowerCase())) return false;

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(text)) return false;

  // Should look like proper text
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

async function translateToArabic(text) {
  try {
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const translatedText = await translate(text, {
      from: 'en',
      to: 'ar'
    });
    return translatedText;
  } catch (error) {
    console.error(`Translation failed for: ${text}`);
    console.error(error);
    return text; // Return original text if translation fails
  }
}

async function processFile(filePath, translations) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  const foundTranslations = new Map();

  // Extract text within JSX
  const jsxTexts = content.match(/>([^<]+)</g) || [];
  for (const match of jsxTexts) {
    const text = match.slice(1, -1).trim();
    if (isTranslatableText(text)) {
      const key = generateTranslationKey(text);
      foundTranslations.set(key, text);
      updatedContent = updatedContent.replace(
        match,
        `>{t('${key}')}<`
      );
    }
  }

  // Extract string literals
  const stringLiterals = content.match(/"([^"]+)"|'([^']+)'/g) || [];
  for (const match of stringLiterals) {
    const text = match.slice(1, -1).trim();
    if (isTranslatableText(text)) {
      const key = generateTranslationKey(text);
      foundTranslations.set(key, text);
      updatedContent = updatedContent.replace(
        match,
        `t('${key}')`
      );
    }
  }

  // Add translation hook import if needed
  if (foundTranslations.size > 0 && !content.includes('useTranslation')) {
    updatedContent = "import { useTranslation } from 'next-i18next';\n" + updatedContent;
    
    // Add t declaration if needed
    if (!content.includes('const { t }')) {
      const functionMatch = updatedContent.match(/^(function|const|export)\s+\w+/m);
      if (functionMatch) {
        const insertPoint = functionMatch.index;
        updatedContent = 
          updatedContent.slice(0, insertPoint) +
          "const { t } = useTranslation();\n\n" +
          updatedContent.slice(insertPoint);
      }
    }
  }

  // Add translations to global object
  foundTranslations.forEach((value, key) => {
    translations[key] = value;
  });

  return {
    updatedContent,
    foundTranslations
  };
}

async function processDirectory(dir) {
  // Load existing translations
  let enTranslations = {};
  let arTranslations = {};
  
  try {
    enTranslations = JSON.parse(fs.readFileSync(TRANSLATION_DIRS.en, 'utf8'));
    arTranslations = JSON.parse(fs.readFileSync(TRANSLATION_DIRS.ar, 'utf8'));
  } catch (error) {
    console.log('Creating new translation files...');
  }

  const summary = {
    filesProcessed: 0,
    translationsFound: 0,
    filesUpdated: new Set()
  };

  async function traverse(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (!file.startsWith('.') && !file.includes('node_modules')) {
          await traverse(fullPath);
        }
        continue;
      }

      if (!['.js', '.jsx', '.tsx'].includes(path.extname(file))) {
        continue;
      }

      // Process file
      const { updatedContent, foundTranslations } = await processFile(
        fullPath,
        enTranslations
      );

      // Update file if changes were made
      if (foundTranslations.size > 0) {
        fs.writeFileSync(fullPath, updatedContent);
        summary.filesUpdated.add(fullPath);
        summary.translationsFound += foundTranslations.size;
      }

      summary.filesProcessed++;
    }
  }

  // Process all files
  await traverse(dir);

  // Translate new entries to Arabic
  for (const [key, value] of Object.entries(enTranslations)) {
    if (!arTranslations[key]) {
      arTranslations[key] = await translateToArabic(value);
    }
  }

  // Save translation files
  if (!fs.existsSync('./public/locales/en')) {
    fs.mkdirSync('./public/locales/en', { recursive: true });
  }
  if (!fs.existsSync('./public/locales/ar')) {
    fs.mkdirSync('./public/locales/ar', { recursive: true });
  }

  fs.writeFileSync(
    TRANSLATION_DIRS.en,
    JSON.stringify(enTranslations, null, 2)
  );
  fs.writeFileSync(
    TRANSLATION_DIRS.ar,
    JSON.stringify(arTranslations, null, 2)
  );

  // Create summary report
  const summaryReport = {
    statistics: {
      filesProcessed: summary.filesProcessed,
      translationsFound: summary.translationsFound,
      filesUpdated: summary.filesUpdated.size
    },
    updatedFiles: Array.from(summary.filesUpdated),
    translations: enTranslations
  };

  fs.writeFileSync(
    'translation-summary.json',
    JSON.stringify(summaryReport, null, 2)
  );

  return summaryReport;
}

// Main execution
async function main() {
  try {
    console.log('Starting translation process...');
    const summary = await processDirectory('./components');
    
    console.log('\nTranslation process complete!');
    console.log(`Files processed: ${summary.statistics.filesProcessed}`);
    console.log(`Translations found: ${summary.statistics.translationsFound}`);
    console.log(`Files updated: ${summary.statistics.filesUpdated}`);
    console.log('\nDetailed summary saved to translation-summary.json');
    
  } catch (error) {
    console.error('Error during translation process:', error);
  }
}

main();