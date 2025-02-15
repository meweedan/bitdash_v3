const fs = require('fs');
const path = require('path');

function findHardcodedText(content) {
    const hardcodedTexts = new Set();
    
    // Match text between JSX tags that contains English words
    // Excludes: <tags>, attributes="values", {expressions}
    const textRegex = />([^<{}]+)</g;
    const matches = content.matchAll(textRegex);

    for (const match of matches) {
        const text = match[1].trim();
        
        // Skip if empty or just whitespace
        if (!text || !text.length) continue;
        
        // Skip if it's just numbers or special characters
        if (!/[a-zA-Z]/.test(text)) continue;
        
        // Skip if it's a common non-translatable string
        if (/^[0-9.]+$/.test(text)) continue;
        if (/^[\/\-_:,.\[\]{}()]+$/.test(text)) continue;
        
        // Skip common development terms
        const commonTerms = ['div', 'span', 'null', 'undefined', 'true', 'false'];
        if (commonTerms.includes(text.toLowerCase())) continue;

        hardcodedTexts.add(text);
    }

    return Array.from(hardcodedTexts);
}

function generateTranslationKey(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .slice(0, 30);
}

function processFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const hardcodedTexts = findHardcodedText(content);
        
        if (hardcodedTexts.length === 0) {
            return null;
        }

        let updatedContent = content;
        const translations = {};
        const changes = [];

        hardcodedTexts.forEach(text => {
            const key = generateTranslationKey(text);
            translations[key] = text;

            // Escape special regex characters in the text
            const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Replace the text with translation function
            const regex = new RegExp(`>(\\s*${escapedText}\\s*)<`, 'g');
            updatedContent = updatedContent.replace(regex, `>{t('${key}')}<`);

            changes.push({
                original: text,
                translationKey: key
            });
        });

        // Add translation import if not present
        if (!content.includes("useTranslation")) {
            updatedContent = "import { useTranslation } from 'next-i18next';\n" + updatedContent;
            
            // Add t declaration if not present
            if (!content.includes("const { t }")) {
                const insertPoint = updatedContent.indexOf('function') !== -1 
                    ? updatedContent.indexOf('function')
                    : updatedContent.indexOf('export default');
                
                updatedContent = updatedContent.slice(0, insertPoint) +
                    "const { t } = useTranslation();\n\n" +
                    updatedContent.slice(insertPoint);
            }
        }

        return {
            filePath,
            changes,
            translations,
            updatedContent
        };

    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return null;
    }
}

function processDirectory(directory) {
    const results = [];
    
    function traverse(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (file.match(/\.(jsx?|tsx)$/)) {
                const result = processFile(fullPath);
                if (result) {
                    results.push(result);
                }
            }
        }
    }

    traverse(directory);
    return results;
}

// Run the script
const sourceDir = './pages';  // Change this to your source directory
const outputDir = './translation-updates';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const results = processDirectory(sourceDir);

// Generate summary and files
results.forEach(result => {
    const fileName = path.basename(result.filePath, path.extname(result.filePath));
    
    // Write updated component file
    fs.writeFileSync(
        path.join(outputDir, `${fileName}.updated.js`),
        result.updatedContent
    );
    
    // Write translations
    fs.writeFileSync(
        path.join(outputDir, `${fileName}.translations.json`),
        JSON.stringify(result.translations, null, 2)
    );
});

// Write summary
const summary = {
    filesProcessed: results.length,
    totalTextsFound: results.reduce((sum, r) => sum + r.changes.length, 0),
    files: results.map(r => ({
        file: path.basename(r.filePath),
        textsFound: r.changes.length,
        changes: r.changes
    }))
};

fs.writeFileSync(
    path.join(outputDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
);

console.log('\nTranslation scan complete!');
console.log(`Files processed: ${summary.filesProcessed}`);
console.log(`Total hardcoded texts found: ${summary.totalTextsFound}`);
console.log(`Results saved in: ${outputDir}`);