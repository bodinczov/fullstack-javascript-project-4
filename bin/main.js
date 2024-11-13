#!/usr/bin/env node
import { downloadPage } from '../src/downloadPage.js';
import parseArguments from '../src/parseArguments.js';

async function main() {
  const { url, outputDir } = parseArguments();
  downloadPage(url, outputDir, (error) => {
    if (error) {
      console.log(`Ошибка: ${error}`);
    } else {
      console.log('Page successfully downloaded!');
    }
  });
}

main();
