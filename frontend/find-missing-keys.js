const fs = require('fs');
const path = require('path');

// Path to your `common.json` file
const commonFilePath = './public/locales/en/common.json';

// Directory containing your pages/components
const sourceDirectory = './frontend';

function extractKeysFromFiles(dir) {
  const keys = new Set();

  function parseFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /t\(['"`]([\w.]+)['"`]\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }

  function traverseDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        traverseDirectory(fullPath);
      } else if (fullPath.endsWith('.js')) {
        parseFile(fullPath);
      }
    });
  }

  traverseDirectory(dir);
  return keys;
}

function compareKeys() {
  const extractedKeys = extractKeysFromFiles(sourceDirectory);
  const commonFile = JSON.parse(fs.readFileSync(commonFilePath, 'utf8'));
  const existingKeys = new Set(Object.keys(commonFile));

  const missingKeys = [...extractedKeys].filter(key => !existingKeys.has(key));
  console.log('Missing Keys:', missingKeys);

  missingKeys.forEach(key => {
    commonFile[key] = ''; // Add empty value for missing keys
  });

  fs.writeFileSync(commonFilePath, JSON.stringify(commonFile, null, 2), 'utf8');
  console.log('Updated common.json with missing keys.');
}

compareKeys();
