const inquirer = require("inquirer");
const generateSlice = require("../generators/sliceGenerator");

const createSlice = async (name) => {
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

    // Ask for the name of the app or lib
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

  // Pass all details to the generator
  await generateSlice(name, projectType, isApp, appName);
};

module.exports = createSlice;
