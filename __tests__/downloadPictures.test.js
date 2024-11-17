import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { load } from 'cheerio';
import { downloadPictures } from '../src/downloadPictures.js';
import { generateDirectoryPath, generateFileName } from '../src/utils.js';

describe('downloadPictures', () => {
  let outputDir;
  let dirPath;
  const baseUrl = 'https://example.com';

  const html = `
    <html>
      <body>
        <img src="/image1.jpg" />
        <img src="https://example.com/assets/image2.png" />
      </body>
    </html>
  `;

  beforeEach(async () => {
    outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'download-pictures-test-'));
    const fileName = generateFileName(baseUrl);
    dirPath = generateDirectoryPath(outputDir, fileName);
    await fs.mkdir(dirPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
    nock.cleanAll();
  });

  test('downloads all images from a page', async () => {
    const image1 = Buffer.from('image1');
    const image2 = Buffer.from('image2');

    nock('https://example.com').get('/image1.jpg').reply(200, image1);
    nock('https://example.com').get('/assets/image2.png').reply(200, image2);

    const $ = load(html);
    await downloadPictures(baseUrl, $, dirPath);

    const image1Path = path.join(dirPath, 'example.com-image1.jpg');
    const image2Path = path.join(dirPath, 'example.com-assets-image2.png');

    const downloadedImage1 = await fs.readFile(image1Path);
    const downloadedImage2 = await fs.readFile(image2Path);

    expect(downloadedImage1.equals(image1)).toBe(true);
    expect(downloadedImage2.equals(image2)).toBe(true);
  });

  test('handles errors when images cannot be downloaded', async () => {
    nock('https://example.com').get('/image1.jpg').reply(404);
    nock('https://example.com').get('/assets/image2.png').reply(200, Buffer.from('image2'));

    const $ = load(html);

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    await downloadPictures(baseUrl, $, dirPath);

    const image1Path = path.join(dirPath, 'example.com-image1.jpg');
    const image2Path = path.join(dirPath, 'example.com-assets-image2.png');

    const image1Exists = await fs.access(image1Path).then(() => true).catch(() => false);
    const image2Exists = await fs.access(image2Path).then(() => true).catch(() => false);

    expect(image1Exists).toBe(false);
    expect(image2Exists).toBe(true);

    expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('Failed to download or save image'));

    consoleErrorMock.mockRestore();
  });
});
