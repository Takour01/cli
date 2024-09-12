const { program } = require("commander");
const { prompt } = require("inquirer");
const fs = require("fs-extra");
const path = require("path");

// Function to create the base folder structure
const createBaseStructure = async (projectPath, projectType, name) => {
  console.log(`Creating ${projectType} project structure at ${projectPath}`);

  if (projectType === "Nx") {
    // Construct the Nx project path
    const nxProjectPath = path.join(projectPath, "apps", name);

    // Check if the project path exists
    if (!fs.pathExistsSync(nxProjectPath)) {
      console.log(`Project path does not exist: ${nxProjectPath}`);
      return; // Exit the function early
    }

    // Create Nx-specific structure
    await fs.ensureDir(path.join(nxProjectPath, "src/assets/images"));
    await fs.ensureDir(path.join(nxProjectPath, "src/data/interfaces"));
    await fs.ensureDir(path.join(nxProjectPath, "src/data/models"));
    await fs.ensureDir(path.join(nxProjectPath, "src/data/repositories"));
    await fs.ensureDir(path.join(nxProjectPath, "src/data/store"));
    await fs.ensureDir(path.join(nxProjectPath, "src/views/components/local"));
    await fs.ensureDir(path.join(nxProjectPath, "src/views/components/ui"));
    await fs.ensureDir(path.join(nxProjectPath, "src/views/layouts"));
    await fs.ensureDir(path.join(nxProjectPath, "src/views/pages"));
    await fs.ensureDir(path.join(nxProjectPath, "src/views/routes"));

    console.log("Nx project structure created successfully!");
  } else {
    // Normal React with Vite structure
    await fs.ensureDir(path.join(projectPath, "src/assets/images"));
    await fs.ensureDir(path.join(projectPath, "src/data/interfaces"));
    await fs.ensureDir(path.join(projectPath, "src/data/models"));
    await fs.ensureDir(path.join(projectPath, "src/data/repositories"));
    await fs.ensureDir(path.join(projectPath, "src/data/store"));
    await fs.ensureDir(path.join(projectPath, "src/views/components/local"));
    await fs.ensureDir(path.join(projectPath, "src/views/components/ui"));
    await fs.ensureDir(path.join(projectPath, "src/views/layouts"));
    await fs.ensureDir(path.join(projectPath, "src/views/pages"));
    await fs.ensureDir(path.join(projectPath, "src/views/routes"));

    console.log(
      "Normal React with Vite project structure created successfully!"
    );
  }
};

// Function to handle the command with or without prompts
const handleInitProject = async (type) => {
  // If the type isn't provided, prompt the user
  if (!type) {
    const answers = await prompt([
      {
        type: "list",
        name: "type",
        message: "Select the type of project:",
        choices: ["Nx", "Normal React with Vite"],
      },
    ]);
    type = answers.type;
  }

  let name = "";
  if (type === "Nx") {
    const answers = await prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the project:",
        validate: function (input) {
          if (input.trim() === "") {
            return "Project name cannot be empty";
          }
          return true;
        },
      },
    ]);
    name = answers.name;
  }

  // Create the folder structure based on the type
  const projectPath = process.cwd();
  await createBaseStructure(projectPath, type, name);
};

module.exports = handleInitProject;
