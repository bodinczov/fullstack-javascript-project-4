import { generateDirectoryPath, generateFileName, generateResourceFileName } from '../src/utils.js';
import path from 'path';

describe('utils', () => {
  test('generateFileName generates correct file names', () => {
    const url = 'https://example.com/page';
    const fileName = generateFileName(url);
    expect(fileName).toBe('example.com_page.html');
  });

  test('generateDirectoryPath generates correct directory paths', () => {
    const outputDir = './output';
    const fileName = 'example.com_page.html';
    const dirPath = generateDirectoryPath(outputDir, fileName);
    expect(dirPath).toBe(path.join(outputDir, 'example.com_page_files'));
  });

  test('generateResourceFileName generates correct resource file names', () => {
    const baseUrl = 'https://example.com';
    const resourceUrl = 'https://example.com/assets/image.jpg';
    const resourceFileName = generateResourceFileName(baseUrl, resourceUrl);
    expect(resourceFileName).toBe('example.com-assets-image.jpg');
  });
});
