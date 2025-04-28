const inquirer = require("inquirer");
const generateRoute = require("../generators/routeGenerator");

const createRoute = async (name) => {
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

  // Ask if there's a layout
  const { hasLayout } = await inquirer.default.prompt({
    type: "confirm",
    name: "hasLayout",
    message: `Do you want to use a layout for the ${name} route?`,
  });

  let layoutName = "";
  if (hasLayout) {
    const { layout } = await inquirer.default.prompt({
      type: "input",
      name: "layout",
      message: `Enter the name of the layout for the ${name} route:`,
      validate: (input) => !!input || "Layout name cannot be empty",
    });
    layoutName = layout;
  }

  // Ask if the route should be added to main routes
  const { addToMainRoutes } = await inquirer.default.prompt({
    type: "confirm",
    name: "addToMainRoutes",
    message: `Do you want to add ${name} to the main routes?`,
  });

  // Pass all details to the generator
  await generateRoute(name, layoutName, hasLayout, addToMainRoutes, projectType, isApp, appName);
};

module.exports = createRoute;
