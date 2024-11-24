#!/usr/bin/env node
import downloadPage from '../src/downloadPage.js';
import parseArguments from '../src/parseArguments.js';

async function main() {
  const { url, outputDir } = parseArguments();
  try {
    await downloadPage(url, outputDir);
    console.log('Page successfully downloaded!');
    process.exit(0);
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    process.exit(1);
  }
}

main();
