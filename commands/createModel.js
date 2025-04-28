const inquirer = require("inquirer");
const generateModel = require("../generators/modelGenerator");

const promptAttributes = async () => {
  let attributes = [];
  while (true) {
    const { attributeName } = await inquirer.default.prompt({
      type: "input",
      name: "attributeName",
      message: `Enter the name of the attribute (leave empty to finish):`,
    });

    if (!attributeName) break;

    const { attributeType } = await inquirer.default.prompt({
      type: "list",
      name: "attributeType",
      message: `Choose the type for ${attributeName}:`,
      choices: ["number", "string", "boolean", "string[]", "number[]"],
    });

    attributes.push({ attributeName, attributeType });
  }
  return attributes;
};

const createModel = async (name) => {
  // Prompt for project type
  const { projectType } = await inquirer.default.prompt([
    {
      type: "list",
      name: "projectType",
      message: "Is this for an Nx library, Nx project, or Vite project?",
      choices: ["nx", "normal", "local"],
    },
  ]);

  let isApp = false;
  let appName = "";

  // If project type is "nx", prompt for additional details
  if (projectType === "nx") {
    const { projectSubtype } = await inquirer.default.prompt([
      {
        type: "list",
        name: "projectSubtype",
        message: "Is this for an Nx library or an Nx app?",
        choices: ["app", "lib"],
      },
    ]);

    const { app } = await inquirer.default.prompt({
      type: "input",
      name: "app",
      message: "Enter the name of the Nx app or lib:",
      validate: (input) => !!input || "App/Lib name cannot be empty",
    });

    isApp = projectSubtype === "app";
    appName = app;
  }

  // Prompt for attributes
  const attributes = await promptAttributes();

  // Pass all details to the generator
  await generateModel(name, projectType, isApp, appName, attributes);
};

module.exports = createModel;
