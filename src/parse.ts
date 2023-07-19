import fs from "node:fs/promises";
import path from "node:path";
import showdown from "showdown";
import jsYaml from "js-yaml";
import shiki from "shiki";
import chalk from "chalk";

const ROOT = process.cwd();

// Keep track of all files that are written.
const writtenFiles = new Set<string>();

// For converting markdown to HTML.
const mdConverter = new showdown.Converter();

// For converting code blocks to HTML.
const htmlHighlighter = await shiki.getHighlighter({ theme: "solarized-dark" });

// Tags along with their corresponding patterns.
const [fileTags, codeTags] = await(async () => {
  const tagsFilePath = `${ROOT}/flashcards/.tags.yaml`;
  const tagsFileData = await fs.readFile(tagsFilePath, "utf-8");
  const tagsData = await jsYaml.load(tagsFileData) as Record<string, Record<string, string>>;
  return Promise.all([
    convertTagPatterns(tagsData["file"]),
    convertTagPatterns(tagsData["code"])
  ]);
})();

// Convert all markdown files to HTML files.
await Promise.all((await getFilePaths())
  .filter((filepath) => filepath.endsWith(".md"))
  .map((filepath) => convertFile(filepath))
);

// Remove all files that are not in the list of files that were just written.
await Promise.all((await getFilePaths())
  .filter((filepath) => !writtenFiles.has(filepath))
  .map((filepath) => fs.rm(filepath, { force: true, recursive: true }))
);

// Generate the Anki cards file to be imported.
const allFiles = await getFilePaths();
const srcFiles = allFiles.filter((filepath) => filepath.endsWith(".md"));
const deckFile = `${ROOT}/deckfile.txt`;
const deckData = [];
deckData.push(`#separator:pipe`);
deckData.push(`#html:true`);
deckData.push(`#notetype column:1`);
await Promise.all(srcFiles.map(async (mdFile) => {
  const frontFile = mdFile.replace(/\.md$/, ".front.html");
  const frontData = allFiles.includes(frontFile) ? await fs.readFile(frontFile, "utf-8") : null;
  const backFile = mdFile.replace(/\.md$/, ".back.html");
  const backData = allFiles.includes(backFile) ? await fs.readFile(backFile, "utf-8") : null;
  const deckType = frontData.includes(`{{c`) ? "Cloze" : "Basic";
  // const tagFile = mdFile.replace(/\.md$/, ".tags.json");
  // const tagData = JSON.parse(await (files.includes(tagFile) ? fs.readFile(tagFile, "utf-8") : new Promise(() => `null`)));
  const parts = [deckType, frontData, backData].filter(Boolean);
  if (parts.length > 1) {
    deckData.push(parts.join("|"));
  } else {
    console.warn(chalk.yellow`No front or back data for file: ${mdFile}`)
  }
}));
await fs.writeFile(deckFile, deckData.join("\n"));

/**
 * Convert a single markdown file into
 * - a front HTML file
 * - a back HTML file
 * - a tags JSON file
 */
async function convertFile(filepath: string) {
  writtenFiles.add(filepath);

  const writeFilePromises: Promise<any>[] = [];
  const writeFile = (path: string, data: string) => {
    writeFilePromises.push(fs.writeFile(path, data));
    writtenFiles.add(path);
  };

  const fileDir = path.dirname(filepath);
  const fileExt = path.extname(filepath);
  const fileBase = path.basename(filepath, fileExt);
  const fileBaseSpaced = fileBase.replace(/[^A-Za-z0-9]+/, " ");
  const fileData = await fs.readFile(filepath, "utf-8");

  // Create a separate tags file if there are any tags in the file.
  const tagsData = new Set<string>();
  // Check if the file name or file contents match any of the tags.
  for (const [tagName, tagPattern] of Object.entries(fileTags))
    if (tagPattern.test(fileBaseSpaced)) tagsData.add(tagName);
  // Check if the file contents match any of the tags.
  for (const [tagName, tagPattern] of Object.entries(codeTags))
    if (tagPattern.test(fileData)) tagsData.add(tagName);
  // If there are any tags, write them to a separate file.
  if (tagsData.size > 0) {
    const tagsFile = `${fileDir}/${fileBase}.tags.json`;
    const tagsJson = JSON.stringify(Array.from(tagsData.values()));
    writeFile(tagsFile, tagsJson);
  }

  // Split the file into front and back sections.
  const filelines = fileData.trim().split("\n");
  const frontLines: string[] = [];
  let backLines: string[] | null = null;
  for (const line of filelines) {
    if (Array.isArray(backLines)) {
      backLines.push(line);
    } else if (line === "===") {
      backLines = [];
    } else {
      frontLines.push(line);
    }
  }

  // Convert the front section to HTML.
  const frontHtml = convertMdCodeBlocks(frontLines.join("\n"));
  const frontFile = `${fileDir}/${fileBase}.front.html`;
  writeFile(frontFile, frontHtml);

  // If there is a back section, convert it to HTML.
  if (backLines) {
    const backHtml = convertMdCodeBlocks(backLines.join("\n"));
    const backFile = `${fileDir}/${fileBase}.back.html`;
    writeFile(backFile, backHtml)
  }

  return Promise.all(writeFilePromises);
}

/**
 * Convert a markdown string's code blocks to HTML code blocks.
 */
function convertMdCodeBlocks(inputStr: string) {
  const inputLines = inputStr.trim().split("\n");
  const outputLines = [];
  const outputBlocks = [];
  const codeLines = [];
  let isInCodeBlock = false;
  let codeLang = "";

  for (const line of inputLines) {
    if (!isInCodeBlock) {
      const m = /^```(.+)?$/.exec(line);
      if (m) {
        isInCodeBlock = true;
        if (m[1]) codeLang = m[1];
        shiftOutputLinesToBlock();
      } else {
        outputLines.push(line);
      }
    } else {
      const m = /^```$/.exec(line);
      if (m) {
        isInCodeBlock = false;
        const opts = {};
        if (codeLang) opts["lang"] = codeLang;
        outputBlocks.push(
          htmlHighlighter
            .codeToHtml(codeLines.join("\n"), opts)
            .replace(/\n/g, "<br/>")
        );
        codeLines.length = 0;
      } else {
        codeLines.push(line);
      }
    }
  }
  shiftOutputLinesToBlock();

  return outputBlocks.join("").replaceAll(
    `<pre class="shiki solarized-dark" style="background-color: `,
    `<pre class="shiki solarized-dark" style="padding: 6px 9px; background-color: `
  // ).replaceAll(
  //   `class="shiki solarized-dark" `,
  //   ""
  );

  // If there are any lines in the outputLines array, convert them to a HTML block.
  // This is done separately so that we can safely format the non-code HTML.
  function shiftOutputLinesToBlock() {
    if (!outputLines.length) return;
    const outputBlock = mdConverter.makeHtml(outputLines.join("\n")).replace(/\n/g, "")
    outputLines.length = 0;
    outputBlocks.push(outputBlock);
  }

}

/**
 * Get all file paths in the flashcards directory.
 */
async function getFilePaths() {
  return (await fs.readdir(`${ROOT}/flashcards`))
    .filter((filename) => !filename.startsWith("."))
    .map((filename) => `${ROOT}/flashcards/${filename}`);
}

/**
 * Convert tag pattern strings into regexps.
 */
function convertTagPatterns(data: Record<string, string>) {
  const patternDelimiter = (...strs: string[]) => `(?:${[...strs, `[^A-Za-z0-9]`].join("|")})`;
  return Object.entries(data).reduce((tags: Record<string, RegExp>, [name, patternStr]) => {
    const patternRe = new RegExp(`${patternDelimiter("^")}${patternStr}${patternDelimiter("$")}`, "i");
    tags[name] = patternRe;
    return tags;
  }, {});
};
