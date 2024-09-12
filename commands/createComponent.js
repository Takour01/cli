const { prompt } = require("inquirer");
const generateComponent = require("../generators/componentGenerator");

const createComponent = async (name) => {
  const { projectType } = await prompt([
    {
      type: "list",
      name: "projectType",
      message: "Is this for an Nx library, Nx project, or Vite project?",
      choices: ["Nx", "Normal React with Vite"],
    },
  ]);

  await generateComponent(name, projectType);
};

module.exports = createComponent;
