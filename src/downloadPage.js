import axios from "axios";
import fs from "fs/promises";
import path from "path";
import jsBeautify from "js-beautify";
import { load as cheerioLoad } from "cheerio";
import { Listr } from "listr2";
import { generateDirectoryPath, generateFileName } from "./utils.js";
import { downloadPictures } from "./downloadPictures.js";
import { downloadOtherResources } from "./downloadOtherResources.js";

const downloadPage = (url, outputDir, callback) => {
  const fileName = generateFileName(url);
  const dirPath = generateDirectoryPath(outputDir, fileName);
  const htmlFilePath = path.join(dirPath, fileName);
  const { html: beautifyHtml } = jsBeautify;

  const tasks = new Listr([
    {
      title: "Checking access to output directory",
      task: () => fs.access(outputDir),
    },
    {
      title: "Creating directory for page resources",
      task: () => fs.mkdir(dirPath, { recursive: true }),
    },
    {
      title: "Fetching page content from URL",
      task: async (ctx) => {
        const response = await axios.get(url);
        ctx.html = response.data;
      },
    },
    {
      title: "Downloading pictures",
      task: async (ctx) => {
        const $ = cheerioLoad(ctx.html);
        ctx.$ = $;
        await downloadPictures(url, $, dirPath);
      },
    },
    {
      title: "Downloading other resources (CSS, JS)",
      task: async (ctx) => {
        await downloadOtherResources(url, ctx.$, dirPath);
      },
    },
    {
      title: "Saving HTML file",
      task: async (ctx) => {
        const formattedHtml = beautifyHtml(ctx.$.html());
        await fs.writeFile(htmlFilePath, formattedHtml);
      },
    },
  ]);

  tasks
    .run()
    .then(() => callback(null))
    .catch((error) => callback(error));
};

export { downloadPage };
