import path from 'path';
import { URL } from 'url';

const generateFileName = (url) => {
  const { hostname, pathname } = new URL(url);
  const sanitizedPath = pathname.replace(/[^a-zA-Z0-9]/g, '_');
  return `${hostname}${sanitizedPath || '_index'}.html`;
};

function generateDirectoryPath(outputDir, fileName) {
  const dirName = fileName.replace(/\.html$/g, '_files');
  return path.join(outputDir, dirName);
}

function generateResourceFileName(url, resourceUrl) {
  const parsedUrl = new URL(resourceUrl, url);
  return `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/\/+/g, '-');
}

export { generateDirectoryPath, generateFileName, generateResourceFileName };
