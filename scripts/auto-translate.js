import { readFile, writeFile } from 'node:fs/promises';
import translate from 'translate';

const sourcePath = new URL('../src/locales/en.json', import.meta.url);
const destinationPath = new URL('../src/locales/ne.json', import.meta.url);
translate.engine = 'google';

const translateCatalog = async (catalog) => {
  const entries = Object.entries(catalog);
  const translatedEntries = await Promise.all(entries.map(async ([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [key, await translateCatalog(value)];
    }

    if (typeof value !== 'string') return [key, value];
    const sourceText = value.trim() || key;
    const translatedValue = await translate(sourceText, { from: 'en', to: 'ne' });
    return [key, translatedValue];
  }));

  return Object.fromEntries(translatedEntries);
};

try {
  const englishCatalog = JSON.parse(await readFile(sourcePath, 'utf8'));
  const nepaliCatalog = await translateCatalog(englishCatalog);
  await writeFile(destinationPath, `${JSON.stringify(nepaliCatalog, null, 2)}\n`);
  console.log(`Translated ${Object.keys(englishCatalog).length} top-level keys to Nepali.`);
} catch (error) {
  console.error(`Translation failed: ${error.message}`);
  process.exitCode = 1;
}
