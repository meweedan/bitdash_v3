const fs = require('fs');
const path = require('path');
const translate = require('translate-google-free');

const LOCALES_DIR = './public/locales';
const TRANSLATION_FILES = {
  en: path.join(LOCALES_DIR, 'en/common.json'),
  ar: path.join(LOCALES_DIR, 'ar/common.json')
};

// Pure UI text patterns - only looking for actual human-readable content
const UI_PATTERNS = [
  // Text between UI component tags
  {
    // <Text>This text</Text>, <Heading>This text</Heading>, etc.
    regex: /<(Text|Heading|Button|Badge|Label|Title|p|h[1-6]|span)[^>]*>([^<>{}\n]+)<\//gi,
    extract: match => match[2].trim()
  },
  // String literals in UI props
  {
    // title="This text", label="This text", etc.
    regex: /(?:title|label|description|placeholder|message)=["']([^"']+)["']/g,
    extract: match => match[1].trim()
  }
];

// Definite non-UI text patterns
const NOT_UI_TEXT = text => (
  text.includes('{') ||               // JSX expressions
  text.includes('(') ||               // Function calls
  text.includes('://') ||             // URLs
  text.includes('=') ||               // Assignments
  text.includes('/>') ||              // Self-closing tags
  text.includes('import') ||          // Import statements
  text.includes('export') ||          // Export statements
  text.match(/^[A-Z][a-z]+[A-Z]/) || // PascalCase
  text.match(/^[a-z]+[A-Z]/) ||      // camelCase
  text.match(/^[a-z-]+$/) ||         // kebab-case
  text.match(/^\d+[a-z%]+$/) ||      // CSS values
  text.match(/^[@\d]/) ||            // Decorators/numbers
  text.match(/^['"`].*['"`]$/) ||    // Raw string literals
  text.length < 2 ||                  // Too short
  !text.match(/[a-zA-Z]/)            // No letters
);

async function translateToArabic(text) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await translate(text, { from: 'en', to: 'ar' });
  } catch (error) {
    console.error(`Translation failed for: ${text}`);
    return text;
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const foundTexts = new Map();
  let updated = false;

  // Check each UI pattern
  for (const pattern of UI_PATTERNS) {
    let match;
    // Reset regex lastIndex
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(content)) !== null) {
      const text = pattern.extract(match).trim();
      
      // Skip if it's not UI text
      if (NOT_UI_TEXT(text)) continue;

      // Generate translation key
      const key = text.toLowerCase()
                     .replace(/[^a-z0-9\s]/g, '')
                     .trim()
                     .replace(/\s+/g, '_')
                     .slice(0, 30);

      // Store the text and update content
      foundTexts.set(key, text);
      content = content.replace(
        new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        `{t('${key}')}`
      );
      updated = true;
    }
  }

  // Only add imports if we found text to translate
  if (updated) {
    // Add translation import if needed
    if (!content.includes('useTranslation')) {
      content = "import { useTranslation } from 'next-i18next';\n" + content;
    }
    
    // Add t declaration if needed
    if (!content.includes('const { t }')) {
      const componentStart = content.match(/function.*?{|const.*?=.*?{|export default.*?{/);
      if (componentStart) {
        const insertPoint = componentStart.index + componentStart[0].length;
        content = 
          content.slice(0, insertPoint) +
          "\n  const { t } = useTranslation();\n" +
          content.slice(insertPoint);
      }
    }
    
    fs.writeFileSync(filePath, content);
  }

  return { foundTexts, updated };
}

async function updateTranslationFiles(newTexts) {
  // Load existing translations
  let enTranslations = {};
  let arTranslations = {};
  
  try {
    if (fs.existsSync(TRANSLATION_FILES.en)) {
      enTranslations = JSON.parse(fs.readFileSync(TRANSLATION_FILES.en, 'utf8'));
    }
    if (fs.existsSync(TRANSLATION_FILES.ar)) {
      arTranslations = JSON.parse(fs.readFileSync(TRANSLATION_FILES.ar, 'utf8'));
    }
  } catch (error) {
    console.log('Creating new translation files...');
  }

  // Add new translations
  let newCount = 0;
  for (const [key, text] of newTexts.entries()) {
    if (!enTranslations[key]) {
      enTranslations[key] = text;
      arTranslations[key] = await translateToArabic(text);
      newCount++;
    }
  }

  // Ensure directories exist
  fs.mkdirSync(path.dirname(TRANSLATION_FILES.en), { recursive: true });
  fs.mkdirSync(path.dirname(TRANSLATION_FILES.ar), { recursive: true });

  // Write files
  fs.writeFileSync(TRANSLATION_FILES.en, JSON.stringify(enTranslations, null, 2));
  fs.writeFileSync(TRANSLATION_FILES.ar, JSON.stringify(arTranslations, null, 2));

  return {
    newTranslations: newCount,
    totalTranslations: Object.keys(enTranslations).length
  };
}

async function processDirectory(dir) {
  const allTexts = new Map();
  const modifiedFiles = new Set();

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

      const { foundTexts, updated } = processFile(fullPath);
      
      if (updated) {
        modifiedFiles.add(fullPath);
        foundTexts.forEach((value, key) => allTexts.set(key, value));
      }
    }
  }

  await traverse(dir);
  const stats = await updateTranslationFiles(allTexts);

  return {
    modifiedFiles: Array.from(modifiedFiles),
    ...stats
  };
}

// Main execution
async function main() {
  console.log('Starting UI text translation process...');
  
  try {
    const results = await processDirectory('./components');
    
    console.log('\nProcess completed successfully!');
    console.log(`New translations added: ${results.newTranslations}`);
    console.log(`Total translations: ${results.totalTranslations}`);
    
    if (results.modifiedFiles.length > 0) {
      console.log('\nModified files:');
      results.modifiedFiles.forEach(file => {
        console.log(`- ${file}`);
      });
    } else {
      console.log('\nNo files needed modification.');
    }
    
  } catch (error) {
    console.error('Error during translation process:', error);
  }
}

main();