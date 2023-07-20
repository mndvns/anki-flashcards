import fs from "node:fs/promises";
import path from "node:path";
import showdown from "showdown";
import jsYaml from "js-yaml";
import shiki from "shiki";
import chalk from "chalk";

const ROOT = process.cwd();

// Keep track of all files that are written.
const writtenFiles = new Set<string>();

// For converting code blocks to HTML.
const htmlHighlighter = await shiki.getHighlighter({ theme: "solarized-dark" });

// For converting markdown to HTML.
const mdConverter = new showdown.Converter({
  disableForced4SpacesIndentedSublists: true,
  emoji: true,
  ghCodeBlocks: true,
  noHeaderId: true,
  omitExtraWLInCodeBlocks: true,
  simpleLineBreaks: true,
  smartIndentationFix: false,
  strikethrough: true,
  underline: true,
});

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

const htmlGroups: Map<string, {
  file: string,
  path: string,
  front: string | null,
  back: string | null
}> = new Map();

// Generate the Anki cards file to be imported.
const allFiles = await getFilePaths();
const srcFiles = allFiles.filter((filepath) => filepath.endsWith(".md"));
const deckFile = `${ROOT}/deckfile.txt`;
const deckData = [];
deckData.push(`#separator:pipe`);
deckData.push(`#html:true`);
deckData.push(`#notetype column:1`);
await Promise.all(srcFiles.map(async (mdPath) => {
  const mdFileName = path.basename(mdPath, ".md");
  const htmlGroup = { file: mdFileName, path: mdPath, front: null, back: null };
  const frontPath = mdPath.replace(/\.md$/, ".front.html");
  const frontData = htmlGroup.front = allFiles.includes(frontPath) ? await fs.readFile(frontPath, "utf-8") : null;
  const backPath = mdPath.replace(/\.md$/, ".back.html");
  const backData = htmlGroup.back = allFiles.includes(backPath) ? await fs.readFile(backPath, "utf-8") : null;
  const deckType = frontData.includes(`{{c`) ? "Cloze" : "Basic";
  // const tagFile = mdFile.replace(/\.md$/, ".tags.json");
  // const tagData = JSON.parse(await (files.includes(tagFile) ? fs.readFile(tagFile, "utf-8") : new Promise(() => `null`)));
  htmlGroups.set(mdFileName, htmlGroup);
  const parts = [deckType, frontData, backData].filter(Boolean);
  if (parts.length > 1) {
    deckData.push(parts.join("|"));
  } else {
    console.warn(chalk.yellow`No front or back data for file: ${mdPath}`)
  }
}));
await fs.writeFile(deckFile, deckData.join("\n"));

// Generate a consolidated HTML file for all flashcards.
let htmlLines = "<!DOCTYPE html>";

// Add the CSS file to the consolidated HTML file.
htmlLines += `<style>${await fs.readFile(`${ROOT}/src/styles.css`)}</style>`;

// Format and add each flashcard to the consolidated HTML file.
Array.from(htmlGroups.values())
  .filter(({ front, back }) => front || back)
  .sort((a, b) => a.file.localeCompare(b.file))
  .forEach(({ file, front, back }, index) => {
    const title = file.replace(/-/g, " ");
    htmlLines += `<article>
      <h1 id="${file}"><a href="#${file}"><b>${title}</b><i>#${index + 1}</i></a></h1>
      <main>
        <section class="front"><header>Front</header><div>${front}</div></section>
        ${back ? `<section class="back"><header>Back</header><div>${back}</div></section>` : ""}
      <main>
    </article>`;
  });

// Convert Anki cloze blocks to HTML format.
htmlLines = htmlLines
  .replace(/\{\{c\d*::/gm, () => `<span class="cloze"><span class="cloze-start">[[</span><span class="cloze-inner">`)
  .replace(/\}\}/gm, () => `</span><span class="cloze-end">]]</span></span>`);

fs.writeFile(`${ROOT}/flashcards.html`, htmlLines);

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

  return outputBlocks.join("")
    .replaceAll(`class="shiki solarized-dark" `, "")
    .replaceAll(
      `<pre style="background-color: `,
      `<pre style="padding: 6px 9px; background-color: `
    );

  // If there are any lines in the outputLines array, convert them to a HTML block.
  // This is done separately so that we can safely format the non-code HTML.
  function shiftOutputLinesToBlock() {
    if (!outputLines.length) return;
    const outputBlock = mdConverter.makeHtml(
      outputLines.join("\n")
        .replace(/(:)\n([^\n])/g, "$1 $2")
        .replace(/([^\n])\n(\w)/g, "$1 $2")
        .replace(/([^\n])\n([^\n\+\-\<])/g, "$1$2") // Remove single newlines.
    )
      .replace(/\n/g, "")
      .replace(/<br \/>([a-z])/g, " $1");
    outputLines.length = 0;
    outputBlocks.push(outputBlock);
  }
}

/**
 * Get all file paths in the flashcards directory.
 */
async function getFilePaths() {
  return (await fs.readdir(`${ROOT}/flashcards`))
    // .filter((filename) => /javascript-language-development-uses.md/.test(filename))
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
