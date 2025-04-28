const fs = require("fs-extra");
const path = require("path");

const generateSlice = async (name, projectType, isApp, appName) => {
  let sliceDir;
  let storePath;

  if (projectType === "nx") {
    if (isApp) {
      sliceDir = path.join("apps", appName, "src/data/store/features");
      storePath = path.join("apps", appName, "src/data/store/store.ts");
    } else {
      sliceDir = path.join("libs", appName, "src/store/features");
      storePath = path.join("libs", appName, "src/store/store.ts");
    }
  } else if (projectType === "normal") {
    sliceDir = path.join("src/data/store/features");
    storePath = path.join("src/data/store/store.ts");
  } else {
    sliceDir = path.join("features");
    storePath = path.join("store.ts");
  }

  // Slice file content
  const sliceContent = `
    import { createSlice } from '@reduxjs/toolkit';

    const initialState = {};

    const ${name}Slice = createSlice({
      name: '${name}',
      initialState,
      reducers: {
        // Add your reducers here
      },
    });

    export const { } = ${name}Slice.actions;
    export default ${name}Slice.reducer;
  `;

  // Ensure the directory exists and create the slice file
  await fs.ensureDir(sliceDir);
  await fs.writeFile(
    path.join(sliceDir, `${name.toLowerCase()}.slice.ts`),
    sliceContent
  );

  console.log(`Redux slice ${name} created successfully in ${sliceDir}!`);

  // Read and modify store.ts
  if (fs.existsSync(storePath)) {
    let storeContent = await fs.readFile(storePath, "utf-8");

    // Add the new reducer import
    const importStatement = `import ${name}Reducer from './features/${name}/${name.toLowerCase()}.slice';\n`;
    if (!storeContent.includes(importStatement)) {
      storeContent = importStatement + storeContent;
    }

    // Add the reducer to the reducers section
    const reducerPattern = /reducers:\s*{([^}]*)}/;
    const match = storeContent.match(reducerPattern);

    if (match) {
      const existingReducers = match[1];
      const newReducers = `${
        existingReducers.trim() ? existingReducers.trim() + "," : ""
      } ${name}: ${name}Reducer`;
      storeContent = storeContent.replace(
        reducerPattern,
        `reducers: {${newReducers}}`
      );
    }

    // Write back the updated store.ts
    await fs.writeFile(storePath, storeContent, "utf-8");
    console.log(`Updated store.ts with ${name} reducer.`);
  } else {
    console.log(`store.ts file not found in ${storePath}.`);
  }
};

module.exports = generateSlice;
