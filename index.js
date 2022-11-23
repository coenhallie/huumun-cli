#!/usr/bin/env node
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import gradient from "gradient-string";
import { createSpinner } from 'nanospinner'
import { writeFile, readdir, readFile } from "fs/promises";
import * as path from 'path'
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcomeAnimation() {
  const welcomeText = chalkAnimation.rainbow("Welcome to the Huumun CLI");
  await sleep();
  welcomeText.stop();
}

await welcomeAnimation();

(async () => {

  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    const frameworkName = i.split('.')[1];
    configFiles[frameworkName] = path.join(configFolderPath, i);
  }

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      message: "What's the name of your project?",
      name: "projectName"
    }
  ])

  const { cssFramework } = await inquirer.prompt([
    {
      type: "list",
      message: "Which Tailwind config do you want to use?",
      name: "cssFramework",
      choices: Object.keys(configFiles),
    }
  ])

  const { sassPrompt } = await inquirer.prompt([
    {
      type: "confirm",
      message: "Would you like to install SASS?",
      name: "sassPrompt",
    }
  ])

  const { javascriptFramework } = await inquirer.prompt([
    {
      type: "list",
      message: "Which framework do you like to use?",
      name: "javascriptFramework",
      choices: ["Nuxt", "Vue 3"],
    }
  ])

  // installing framework dependencies
  const installDependencies = async (javascriptFramework) => {
    const installCommand = javascriptFramework === "Nuxt" ? `npx nuxi init ${projectName} npm install -D tailwindcss` : "npm install vue@next --save-dev";
    exec(installCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  };

  // install dependencies
  await installDependencies(javascriptFramework);

  let config = await readFile(configFiles[cssFramework]).catch(console.log);

  const tailwindConfig = path.join(__dirname, 'tailwind.config.js');

  await writeFile(tailwindConfig, config.toString()).catch(err => {
    console.log(err);
    process.exit();
  });

  const installSpinner = async () => {
    const spinner = createSpinner('installing....').start();
    await sleep()
    spinner.stop()
  }

  await installSpinner();

  const installComplete = async () => {
    const message = 'Installation complete!';
    figlet(message, (err, data) => {
      console.log(gradient.pastel.multiline(data));
    });
  };

  await installComplete();
})();