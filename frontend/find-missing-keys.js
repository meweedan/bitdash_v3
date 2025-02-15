const fs = require('fs');
const path = require('path');

const commonFilePath = './public/locales/en/common.json';
const sourceDirectory = './components/landing';

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

function unflattenObject(obj) {
  const result = {};
  
  for (const key in obj) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        current[k] = obj[key];
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    }
  }
  
  return result;
}

function extractKeysFromFiles(dir) {
  const keys = new Set();

  function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Match different translation patterns
    const patterns = [
      /t\(['"`]([-\w.]+)['"`]\)/g,                    // t('key')
      /useTranslation\(\s*['"`]([-\w.]+)['"`]\s*\)/g, // useTranslation('key')
      /Trans\s+i18nKey=['"`]([-\w.]+)['"`]/g,         // <Trans i18nKey='key' />
      /t\(`([-\w.]+)`\)/g,                            // t(`key`)
      /t\(['"`]common:([-\w.]+)['"`]\)/g              // t('common:key')
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        // Get the captured group (the translation key)
        const key = match[1];
        if (!key.includes('${')) { // Ignore dynamic template literals
          keys.add(key);
        }
      }
    });
  }

  function traverseDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverseDirectory(fullPath);
      } else if (/\.(js|jsx|tsx)$/.test(file)) {  // Handle more file extensions
        parseFile(fullPath);
      }
    });
  }

  traverseDirectory(dir);
  return keys;
}

function compareKeys() {
  try {
    // Extract keys from source files
    console.log('Extracting keys from source files...');
    const extractedKeys = extractKeysFromFiles(sourceDirectory);
    console.log(`Found ${extractedKeys.size} unique translation keys in source`);

    // Load and parse common.json
    console.log('Loading common.json...');
    const commonFile = JSON.parse(fs.readFileSync(commonFilePath, 'utf8'));
    const flattenedCommon = flattenObject(commonFile);
    const existingKeys = new Set(Object.keys(flattenedCommon));

    // Find missing and unused keys
    const missingKeys = [...extractedKeys].filter(key => !existingKeys.has(key));
    const unusedKeys = [...existingKeys].filter(key => !extractedKeys.has(key));

    // Report findings
    console.log('\n=== Translation Key Analysis ===');
    if (missingKeys.length > 0) {
      console.log('\nMissing translations:');
      missingKeys.forEach(key => console.log(`- ${key}`));
    }

    if (unusedKeys.length > 0) {
      console.log('\nUnused translations:');
      unusedKeys.forEach(key => console.log(`- ${key}`));
    }

    // Add missing keys to common.json
    if (missingKeys.length > 0) {
      console.log('\nUpdating common.json...');
      const updatedCommon = { ...flattenedCommon };
      missingKeys.forEach(key => {
        updatedCommon[key] = '';
      });
      
      // Write back the updated translations while preserving structure
      fs.writeFileSync(
        commonFilePath, 
        JSON.stringify(unflattenObject(updatedCommon), null, 2),
        'utf8'
      );
      console.log(`Added ${missingKeys.length} missing keys to common.json`);
    }

    console.log('\nAnalysis complete!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

compareKeys();