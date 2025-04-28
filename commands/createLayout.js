const inquirer = require("inquirer");
const generateLayout = require("../generators/layoutGenerator");

const createLayout = async (name) => {
  // Ask for project type (Nx, normal, or local)
  const { projectType } = await inquirer.default.prompt({
    type: "list",
    name: "projectType",
    message: "Is this for an Nx library, Nx project, or Vite project?",
    choices: ["nx", "normal", "local"],
  });

  let isApp = false;
  let appName = "";

  // If project type is Nx, ask if it's for an app or a library and get the app/lib name
  if (projectType === "nx") {
    const { projectSubtype } = await inquirer.default.prompt({
      type: "list",
      name: "projectSubtype",
      message: "Is this for an Nx library or an Nx app?",
      choices: ["app", "lib"],
    });

    const { app } = await inquirer.default.prompt({
      type: "input",
      name: "app",
      message: "Enter the name of the Nx app or lib:",
      validate: (input) => !!input || "App/Lib name cannot be empty",
    });

    isApp = projectSubtype === "app";
    appName = app;
  }

  // Pass all details to the generator
  await generateLayout(name, projectType, isApp, appName);
};

module.exports = createLayout;
