const inquirer = require("inquirer");
const generateComponent = require("../generators/componentGenerator");

const createComponent = async (name) => {
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
  let isPageComponent = false;
  let pageName = "";

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

  // Ask if it's a page component or normal component
  const { pageComponent } = await inquirer.default.prompt([
    {
      type: "input",
      name: "pageComponent",
      message: "Enter the name of the page if this is a page component (leave empty for a normal component):",
    },
  ]);

  // Determine if it's a page component or a normal component
  if (pageComponent) {
    isPageComponent = true;
    pageName = pageComponent;
  }

  // Pass all details to the generator
  await generateComponent(name, projectType, isApp, appName, isPageComponent, pageName);
};

module.exports = createComponent;
