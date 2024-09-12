#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");

// Function to create folders for shared UI library
const createSharedUiFolders = async (uiPath) => {
  console.log(`Creating shared UI folder structure at ${uiPath}`);

  await fs.ensureDir(path.join(uiPath, "src/pages/HomePage/components"));
  await fs.ensureDir(path.join(uiPath, "src/layout"));
  await fs.ensureDir(path.join(uiPath, "src/routes"));
  await fs.ensureDir(path.join(uiPath, "src/components/shared"));
  await fs.ensureDir(path.join(uiPath, "src/components/local"));

  console.log("Shared UI folder structure created.");
};

// Function to create folders for shared logic library
const createSharedLogicFolders = async (logicPath) => {
  console.log(`Creating shared logic folder structure at ${logicPath}`);

  await fs.ensureDir(path.join(logicPath, "src/interfaces"));
  await fs.ensureDir(path.join(logicPath, "src/repositories"));
  await fs.ensureDir(path.join(logicPath, "src/store/features"));
  await fs.ensureDir(path.join(logicPath, "src/utils"));

  console.log("Shared logic folder structure created.");
};

// Function to initialize folder structures for multiple libraries
const initLibraries = async () => {
  const libsDir = path.join(process.cwd(), "libs");

  // Read all the folders inside the libs directory
  const libFolders = fs
    .readdirSync(libsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const lib of libFolders) {
    const libPath = path.join(libsDir, lib);

    if (lib.includes("ui")) {
      await createSharedUiFolders(libPath);
    } else if (lib.includes("logic")) {
      await createSharedLogicFolders(libPath);
    } else {
      console.log(`Skipping ${lib}: not a UI or logic library.`);
    }
  }
};

module.exports = initLibraries;
