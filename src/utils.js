// utils.js
import path from 'path';
import { URL } from 'url';

const sanitize = (str) => str.replace(/[^a-zA-Z0-9\.]/g, '-');

const generateFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const name = `${hostname}${pathname}`;
  const sanitizedFileName = sanitize(name);
  return `${sanitizedFileName || 'index'}.html`;
};

function generateDirectoryPath(outputDir, fileName) {
  const dirName = fileName.replace(/\.html$/, '_files');
  return path.join(outputDir, dirName);
}

function generateResourceFileName(url, resourceUrl) {
  const parsedUrl = new URL(resourceUrl, url);
  const name = `${parsedUrl.hostname}${parsedUrl.pathname}`;
  const sanitizedFileName = sanitize(name);
  const extname = path.extname(parsedUrl.pathname) || '';
  return `${sanitizedFileName}${extname}`;
}

export { generateDirectoryPath, generateFileName, generateResourceFileName };
