#!/usr/bin/env node
const { program } = require("commander");
const handleInitProject = require("./commands/init");

// Import all the file creation commands
const createComponent = require("./commands/createComponent");
const createPage = require("./commands/createPage");
const createSlice = require("./commands/createSlice");
const createRepository = require("./commands/createRepository");
const createInterface = require("./commands/createInterface");
const createStore = require("./commands/createStore");

// CLI setup for creating components, pages, slices, etc.
program
  .command("create <type> <name>")
  .description(
    "Create a new file structure for a component, page, slice, repository, interface, or store"
  )
  .action(async (type, name) => {
    switch (type) {
      case "component":
        await createComponent(name);
        break;
      case "page":
        await createPage(name);
        break;
      case "slice":
        await createSlice(name);
        break;
      case "repository":
        await createRepository(name);
        break;
      case "interface":
        await createInterface(name);
        break;
      case "store":
        await createStore(name);
        break;
      default:
        console.log(
          "Invalid type. Choose from: component, page, slice, repository, interface, store."
        );
    }
  });

// CLI setup for initializing a project or library
program
  .command("init")
  .description("Initialize folder structures for a project or shared libraries")
  .option("-t, --type <type>", "Type of project (Nx or Vite)")
  .option("-p, --project <project>", "is project or library (pr or lib)")
  .action(async (type, project) => {
    await handleInitProject(type, project);
  });

program.parse(process.argv);
