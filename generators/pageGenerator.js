const fs = require("fs-extra");
const path = require("path");

const generatePage = async (name, projectType, isApp, appName) => {
  let pageDir;

  if (projectType === "nx") {
    // If it's an Nx app, use the appName in the directory path
    if (isApp) {
      pageDir = path.join("apps", appName, "src/views/pages", name);
    } else {
      // If it's an Nx lib, use the lib name
      pageDir = path.join("libs", appName, "src/pages", name);
    }
  } else if (projectType === "normal") {
    // For normal project types, use the standard path
    pageDir = path.join("src/views/pages", name);
  } else {
    // For local projects, use a custom directory path
    pageDir = path.join(name);
  }

  // Page component content
  const pageContent = `
    import React from 'react';
    import use${name}VM from "./${name.toLowerCase()}.vm"
    const ${name} = () => {
      const {} = use${name}VM()  

      return <div>${name} Page</div>;
    };

    export default ${name};
  `;
  // vm component content
  const vmContent = `
    import React from 'react';

    const use${name}VM = () => {
      return {}
    };

    export default use${name}VM;
  `;

  // SCSS file content
  const scssContent = `.${name.toLowerCase()} {
    // Add your styles here
  }`;

  // Ensure directory exists and create the files
  await fs.ensureDir(pageDir);
  await fs.writeFile(
    path.join(pageDir, `${name.toLowerCase()}.page.tsx`),
    pageContent
  );
  await fs.writeFile(
    path.join(pageDir, `${name.toLowerCase()}.vm.tsx`),
    vmContent
  );
  await fs.writeFile(
    path.join(pageDir, `${name.toLowerCase()}.scss`),
    scssContent
  );

  console.log(`Page ${name} created successfully in ${pageDir}!`);
};

module.exports = generatePage;
