import path from 'path';
import fs from 'fs/promises';
import nock from 'nock';
import { downloadPage } from '../src/downloadPage.js';

const fixturesPath = path.resolve(__dirname, '../__fixtures__');

describe('downloadPage', () => {
  const pageUrl = 'https://example.com';
  const outputDir = path.join(fixturesPath, 'output');

  beforeEach(async () => {
    await fs.mkdir(outputDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(outputDir, { recursive: true, force: true });
    nock.cleanAll();
  });

  test('downloads a page and its resources successfully', (done) => {
    const pageHtml = '<html><head></head><body><h1>Hello, World!</h1></body></html>';

    nock('https://example.com').get('/').reply(200, pageHtml);

    downloadPage(pageUrl, outputDir, async (error) => {
      try {
        expect(error).toBeNull();

        const htmlFileName = 'example.com_.html';
        const dirName = 'example.com__files';
        const htmlFilePath = path.join(outputDir, dirName, htmlFileName);

        const downloadedHtml = await fs.readFile(htmlFilePath, 'utf8');
        expect(downloadedHtml).toContain('<h1>Hello, World!</h1>');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  test('handles errors when page cannot be downloaded', (done) => {
    nock('https://example.com').get('/').reply(404);

    downloadPage(pageUrl, outputDir, (error) => {
      try {
        expect(error).not.toBeNull();
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
