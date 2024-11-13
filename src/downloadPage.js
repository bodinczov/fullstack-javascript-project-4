import axios from "axios";
import fsp from 'fs/promises';
import path from 'path';
import pkg from 'js-beautify';
import * as cheerio from 'cheerio';
import { generateDirectoryPath, generateFileName } from "../src/utils.js";
import { downloadPictures } from "../src/downloadPictures.js";

const { html: beautifyHtml } = pkg;

let htmlPage = '';

const downloadPage = (url, outputDir, callback) => {
  const fileName = generateFileName(url);
  const dirPath = generateDirectoryPath(outputDir, fileName);

  fsp.access(outputDir)
    .then(() => fsp.mkdir(dirPath, { recursive: true }))
    .then(() => axios.get(url))
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Error! Status code: ${response.status}`);
      }

      const $ = cheerio.load(response.data);
      return downloadPictures(url, $, dirPath)
        .then(() => beautifyHtml($.html()));
    })
    .then((formattedHtml) => {
      const filePath = path.join(dirPath, fileName);
      return fsp.writeFile(filePath, formattedHtml);
    })
    .then(() => callback(null))
    .catch((error) => callback(error));
};


export { downloadPage, htmlPage };
