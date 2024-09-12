const handleInitProject = require("../react-init");
const initLibraries = require("../shared-init");

const handleInit = async (type, project) => {
  if (!project) {
    await handleInitProject(type);
    console.log("Folder structures for Vite project created.");
  } else {
    switch (project) {
      case "pr":
        await handleInitProject(type);
        break;
      case "lib":
        await initLibraries();
        console.log(
          "Folder structures for shared UI and logic libraries created."
        );
        break;
      default:
        console.log(
          "You need to choose between pr (project) and lib (library)."
        );
    }
  }
};

module.exports = handleInit;
