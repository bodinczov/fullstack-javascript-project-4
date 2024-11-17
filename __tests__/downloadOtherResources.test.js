import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import nock from 'nock';
import { load } from 'cheerio';
import { downloadOtherResources } from '../src/downloadOtherResources.js';
import { generateDirectoryPath, generateFileName } from '../src/utils.js';

describe('downloadOtherResources', () => {
  let outputDir;
  let dirPath;
  const baseUrl = 'https://example.com';

  const html = `
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css">
        <script src="/script.js"></script>
      </head>
      <body></body>
    </html>
  `;

  beforeEach(async () => {
    outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'download-other-resources-test-'));
    const fileName = generateFileName(baseUrl);
    dirPath = generateDirectoryPath(outputDir, fileName);
    await fs.mkdir(dirPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
    nock.cleanAll();
  });

  test('downloads CSS and JS resources from a page', async () => {
    const cssContent = 'body { background: #fff; }';
    const jsContent = 'console.log("Hello, World!");';

    nock('https://example.com').get('/styles.css').reply(200, cssContent);
    nock('https://example.com').get('/script.js').reply(200, jsContent);

    const $ = load(html);
    await downloadOtherResources(baseUrl, $, dirPath);

    const cssPath = path.join(dirPath, 'example.com-styles.css');
    const jsPath = path.join(dirPath, 'example.com-script.js');

    const downloadedCss = await fs.readFile(cssPath, 'utf8');
    const downloadedJs = await fs.readFile(jsPath, 'utf8');

    expect(downloadedCss).toBe(cssContent);
    expect(downloadedJs).toBe(jsContent);
  });

  test('handles errors when resources cannot be downloaded', async () => {
    nock('https://example.com').get('/styles.css').reply(404);
    nock('https://example.com').get('/script.js').reply(200, 'console.log("Test");');

    const $ = load(html);

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    await downloadOtherResources(baseUrl, $, dirPath);

    const cssPath = path.join(dirPath, 'example.com-styles.css');
    const jsPath = path.join(dirPath, 'example.com-script.js');

    const cssExists = await fs.access(cssPath).then(() => true).catch(() => false);
    const jsExists = await fs.access(jsPath).then(() => true).catch(() => false);

    expect(cssExists).toBe(false);
    expect(jsExists).toBe(true);

    expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch or save resource'));

    consoleErrorMock.mockRestore();
  });
});
