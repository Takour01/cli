const fs = require("fs-extra");
const path = require("path");

const generateComponent = async (name, projectType) => {
  let componentDir;
  if (projectType === "Nx") {
    componentDir = path.join(
      "apps",
      "your-app",
      "src/views/components/local",
      name
    );
  } else {
    componentDir = path.join("src/views/components/local", name);
  }

  const componentContent = `import React from 'react';\n\nconst ${name} = () => {\n  return <div>${name} Component</div>;\n};\n\nexport default ${name};\n`;
  const scssContent = `.${name.toLowerCase()} {\n  // Add your styles here\n}\n`;

  await fs.ensureDir(componentDir);
  await fs.writeFile(path.join(componentDir, `${name}.tsx`), componentContent);
  await fs.writeFile(path.join(componentDir, `${name}.scss`), scssContent);
  console.log(`Component ${name} created successfully!`);
};

module.exports = generateComponent;
