import axios from 'axios';
import path from 'path';
import { URL } from 'url';
import fsp from 'fs/promises';
import { generateResourceFileName } from './utils.js';

export const downloadOtherResources = async (url, $, dirPath) => {
  const downloadPromises = [];

  const downloadResource = (tag, attr) => {
    $(tag).each((_, element) => {
      const resourceAttr = $(element).attr(attr);
      if (!resourceAttr) return;

      try {
        const resourceUrl = new URL(resourceAttr, url).toString();
        const resourceFileName = generateResourceFileName(url, resourceUrl);
        const resourceFilePath = path.join(dirPath, resourceFileName);

        $(element).attr(attr, resourceFileName);

        const downloadPromise = axios
          .get(resourceUrl, { responseType: 'arraybuffer' })
          .then((response) => {
            return fsp.mkdir(path.dirname(resourceFilePath), { recursive: true })
              .then(() => fsp.writeFile(resourceFilePath, response.data));
          })
          .catch((error) => {
            console.error(`Failed to fetch or save resource: ${resourceUrl}, Error: ${error.message}`);
          });

        downloadPromises.push(downloadPromise);
      } catch (error) {
        console.error(`Failed to process ${tag} with ${attr}: ${error.message}`);
      }
    });
  };

  downloadResource('script', 'src');
  downloadResource('link', 'href');

  await Promise.all(downloadPromises);
};
