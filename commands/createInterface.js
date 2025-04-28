const inquirer = require("inquirer");
const generateInterface = require("../generators/interfaceGenerator");

const commonZodTypes = [
  "z.string()",
  "z.number()",
  "z.boolean()",
  "z.date()",
  "z.array(z.string())",
  "z.enum(['option1', 'option2'])",
  "z.object({})",
  "z.optional(z.string())",
  "z.nullable(z.string())",
  "z.unknown()",
  "z.any()",
  "z.undefined()",
  "z.null()",
  "z.bigint()",
  "z.union([z.string(), z.number()])",
];

const promptAttributes = async (type) => {
  let attributes = [];
  while (true) {
    const { attributeName } = await inquirer.default.prompt({
      type: "input",
      name: "attributeName",
      message: `Enter the name of the ${type} attribute (leave empty to finish):`,
    });

    if (!attributeName) break;

    const { zodType } = await inquirer.default.prompt({
      type: "list",
      name: "zodType",
      message: `Choose the Zod type for ${attributeName}:`,
      choices: commonZodTypes,
    });

    attributes.push({ attributeName, zodType });
  }
  return attributes;
};

const createInterface = async (name) => {
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

    const { app } = await inquirer.default.prompt([
      {
        type: "input",
        name: "app",
        message: "Enter the name of the Nx app or lib:",
        validate: (input) => !!input || "App/Lib name cannot be empty",
      },
    ]);

    isApp = projectSubtype === "app";
    appName = app;
  }

  // Ask if user wants to create Add schema
  const { wantAdd } = await inquirer.default.prompt({
    type: "confirm",
    name: "wantAdd",
    message: "Do you want to create an Add Zod schema?",
  });

  let addAttributes = [];
  if (wantAdd) {
    addAttributes = await promptAttributes("Add");
  }

  // Ask if user wants to create Edit schema
  const { wantEdit } = await inquirer.default.prompt({
    type: "confirm",
    name: "wantEdit",
    message: "Do you want to create an Edit Zod schema?",
  });

  let editAttributes = [];
  let sameAsAdd = false;
  if (wantEdit) {
    const { sameAsAddPrompt } = await inquirer.default.prompt({
      type: "confirm",
      name: "sameAsAddPrompt",
      message: "Do you want to keep the same attributes as Add, but make them optional?",
    });
    sameAsAdd = sameAsAddPrompt;

    if (!sameAsAdd) {
      editAttributes = await promptAttributes("Edit");
    }
  }

  // Pass all details to the generator
  await generateInterface(name, projectType, isApp, appName, addAttributes, editAttributes, sameAsAdd);
};

module.exports = createInterface;
