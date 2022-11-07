#!/usr/bin/env node
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { writeFile, readdir, readFile } from "fs/promises";
import * as path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');

const defaultConfig = { "technology": "Default" };

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcomeAnimation() {
  const welcomeText = chalkAnimation.rainbow("Welcome to the Huumun CLI");
  await sleep();
  welcomeText.stop();
}

await welcomeAnimation();

(async () => {

  const files = await readdir(configFolderPath).catch(console.log);
  const useDefault = process.argv[2] === "-y";

  for (let i of files) {
    // framework name is situated between 2 dots eg- react between 2 '.'(s)
    const frameworkName = i.split('.')[1];
    configFiles[frameworkName] = path.join(configFolderPath, i);
  }

  const { technology } = useDefault ? defaultConfig : await inquirer.prompt([
    {
      type: "list",
      message: "Which Tailwind config do you want to use?",
      name: "technology",
      choices: Object.keys(configFiles),
    }
  ])

  let config = await readFile(configFiles[technology]).catch(console.log);

  const tailwindConfig = path.join(process.cwd(), 'tailwind.config.js');

  await writeFile(tailwindConfig, config.toString()).catch(err => {
    console.log(err);
    process.exit();
  });

  console.log("tailwind.config.json successfully created");
})();