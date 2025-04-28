const fs = require("fs-extra");
const path = require("path");

const generateComponent = async (
  name,
  projectType,
  isApp,
  appName,
  isPageComponent,
  pageName
) => {
  let componentDir;

  if (projectType === "nx") {
    if (isApp) {
      componentDir = isPageComponent
        ? path.join("apps", appName, "src/views/pages", pageName, "cm", name)
        : path.join("apps", appName, "src/views/components/local", name);
    } else {
      componentDir = isPageComponent
        ? path.join("libs", appName, "src/pages", pageName, "cm", name)
        : path.join("libs", appName, "src/components/local", name);
    }
  } else if (projectType === "normal") {
    componentDir = isPageComponent
      ? path.join("src/views/pages", pageName, "cm", name)
      : path.join("src/views/components/local", name);
  } else {
    componentDir = isPageComponent
      ? path.join("pages", pageName, "cm", name)
      : path.join(name);
  }

  // Component UI file
  const componentContent = `
    import React from 'react';
    import use${name}VM from "./${name.toLowerCase()}.vm";

    const ${name} = () => {
      const {} = use${name}VM();
      return <div>${name} Component</div>;
    };

    export default ${name};
  `;

  // ViewModel logic file
  const vmContent = `
    import React from 'react';

    const use${name}VM = () => {
      return {};
    };

    export default use${name}VM;
  `;

  // SCSS file for component styling
  const scssContent = `.${name.toLowerCase()} {
    // Add your styles here
  }`;

  await fs.ensureDir(componentDir);
  await fs.writeFile(
    path.join(componentDir, `${name.toLowerCase()}.cm.tsx`),
    componentContent
  );
  await fs.writeFile(
    path.join(componentDir, `${name.toLowerCase()}.vm.tsx`),
    vmContent
  );
  await fs.writeFile(
    path.join(componentDir, `${name.toLowerCase()}.scss`),
    scssContent
  );

  console.log(`Component ${name} created successfully in ${componentDir}!`);
};

module.exports = generateComponent;
