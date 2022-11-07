#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import {createSpinner} from "nanospinner"

let playerName;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const welcomeText = chalkAnimation.rainbow(
    'Welcome to the Huumun CLI'
    );

  await sleep();
  welcomeText.stop();
}

await welcome();

async function askName() {
  const question = [
    {
      name: "name",
      type: "input",
      message: "What is your name?",
    },
  ];

  const answer = await inquirer.prompt(question);
  playerName = answer.name;
  console.log(`Hello ${playerName}!`);
}

await askName();

async function clientQuestion() {
  const question = [
    {
      name: "client question",
      type: "list",
      message: "For which client do you want to create a new project?",
      choices: ["Sanofi Pasteur", "Pfizer", "Takeda"],
    },
  ];

  const answer = await inquirer.prompt(question);
  console.log(`Your question was: ${answer.clientQuestion}`);
}

await clientQuestion();