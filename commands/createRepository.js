const inquirer = require("inquirer");
const generateRepository = require("../generators/repositoryGenerator");

const createRepository = async (name) => {
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

  // Ask if the user uses a utility function
  const { usesUtil } = await inquirer.default.prompt({
    type: "confirm",
    name: "usesUtil",
    message: "Do you use utilities for API requests?",
  });

  // Ask if the user wants to generate CRUD methods
  const { wantsCRUD } = await inquirer.default.prompt({
    type: "confirm",
    name: "wantsCRUD",
    message:
      "Do you want to generate CRUD methods (fetch all, fetch one, add, edit, delete)?",
  });

  let additionalMethods = [];
  let methodName;

  // Loop for additional methods
  while (true) {
    const { addMethod } = await inquirer.default.prompt({
      type: "input",
      name: "methodName",
      message: "Enter a method name (leave empty to finish):",
    });

    methodName = addMethod;
    if (!methodName) break;

    let httpMethod = "get";
    if (!usesUtil) {
      const { methodType } = await inquirer.default.prompt({
        type: "list",
        name: "httpMethod",
        message: `Which HTTP method for ${methodName}?`,
        choices: ["get", "post", "put", "patch", "delete"],
      });
      httpMethod = methodType;
    }

    additionalMethods.push({ methodName, httpMethod });
  }

  // Pass all details to the generator
  await generateRepository(
    name,
    projectType,
    isApp,
    appName,
    usesUtil,
    wantsCRUD,
    additionalMethods
  );
};

module.exports = createRepository;
