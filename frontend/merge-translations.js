const fs = require('fs');

function mergeTranslations(summaryFile, commonFile) {
    try {
        // Read files
        const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
        const common = JSON.parse(fs.readFileSync(commonFile, 'utf8'));

        let newTranslations = {};
        let duplicateCount = 0;
        let addedCount = 0;

        // Process each file's changes
        summary.files.forEach(file => {
            file.changes.forEach(change => {
                const key = change.translationKey;
                const value = change.original;

                // Skip if key already exists in common.json
                if (common[key]) {
                    duplicateCount++;
                    return;
                }

                // Skip if value appears to be code or a variable
                if (value.includes('===') || 
                    value.includes('=>') || 
                    value.includes('attributes') ||
                    value.includes('${') ||
                    value.includes('?') ||
                    value.includes('.map(') ||
                    value.match(/^[a-z]+\.[a-z]+$/i)) {
                    return;
                }

                // Add new translation
                newTranslations[key] = value;
                addedCount++;
            });
        });

        // Merge with existing translations
        const mergedTranslations = {
            ...common,
            ...newTranslations
        };

        // Write back to file
        fs.writeFileSync(
            commonFile,
            JSON.stringify(mergedTranslations, null, 2),
            'utf8'
        );

        console.log(`Merge complete!`);
        console.log(`Added ${addedCount} new translations`);
        console.log(`Skipped ${duplicateCount} existing translations`);

    } catch (error) {
        console.error('Error merging translations:', error);
    }
}

// Run the merge
mergeTranslations('./translation-updates/summary.json', './public/locales/en/common.json');