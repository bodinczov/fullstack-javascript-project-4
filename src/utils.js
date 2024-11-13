import path from 'path';
import { URL } from 'url';

function generateFileName(url) {
  const parsedUrl = new URL(url);
  const formattedName = `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/\/+/g, '-');
  const fileName = `${formattedName}.html`;
  return fileName;
}

function generateDirectoryPath(outputDir, fileName) {
  const dirName = fileName.replace(/\.html/g, '_files');
  return path.join(outputDir, dirName);
}

function generateResourceFileName(url, resourceUrl) {
  const parsedUrl = new URL(resourceUrl, url);
  return `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/\/+/g, '-');
}

export { generateDirectoryPath, generateFileName, generateResourceFileName };
