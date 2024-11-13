import axios from 'axios';
import path from 'path';
import { URL } from 'url';
import fsp from 'fs/promises';

function generateResourceFileName(url, resourceUrl) {
  const parsedUrl = new URL(resourceUrl, url);
  return `${parsedUrl.hostname}${parsedUrl.pathname}`.replace(/\/+/g, '-');
}

export async function downloadPictures(url, $, dirPath) {
  const downloadPromises = [];

  $('img').each((_, element) => {
    const imgSrc = $(element).attr('src');
    const resourceUrl = new URL(imgSrc, url).toString();
    const resourceFileName = generateResourceFileName(url, resourceUrl);
    const resourceFilePath = path.join(dirPath, resourceFileName);
    $(element).attr('src', path.join(path.basename(dirPath), resourceFileName));
    const downloadPromise = axios
      .get(resourceUrl, { responseType: 'arraybuffer' })
      .then((imageResponse) => fsp.writeFile(resourceFilePath, imageResponse.data));
    downloadPromises.push(downloadPromise);
  });
  await Promise.all(downloadPromises);
}
