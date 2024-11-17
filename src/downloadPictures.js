import axios from 'axios';
import path from 'path';
import { URL } from 'url';
import fsp from 'fs/promises';
import { generateResourceFileName } from './utils.js';

export async function downloadPictures(url, $, dirPath) {
  const downloadPromises = [];

  $('img').each((_, element) => {
    const imgSrc = $(element).attr('src');
    if (!imgSrc) return;

    try {
      const resourceUrl = new URL(imgSrc, url).toString();
      const resourceFileName = generateResourceFileName(url, resourceUrl);
      const resourceFilePath = path.join(dirPath, resourceFileName);

      $(element).attr('src', resourceFileName);

      const downloadPromise = axios
        .get(resourceUrl, { responseType: 'arraybuffer' })
        .then((imageResponse) => fsp.writeFile(resourceFilePath, imageResponse.data))
        .catch((error) => {
          console.error(`Failed to download or save image: ${resourceUrl}, Error: ${error.message}`);
        });

      downloadPromises.push(downloadPromise);
    } catch (error) {
      console.error(`Failed to process image: ${imgSrc}, Error: ${error.message}`);
    }
  });

  await Promise.all(downloadPromises);
}
