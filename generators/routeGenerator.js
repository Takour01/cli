const fs = require("fs-extra");
const path = require("path");

const addToMainRoutes = async (name, projectType, isApp, appName) => {
  let mainRoutesPath;

  if (projectType === "nx") {
    mainRoutesPath = isApp
      ? path.join("apps", appName, "src/views/routes", "main.route.tsx")
      : path.join("libs", appName, "src/views/routes", "main.route.tsx");
  } else if (projectType === "normal") {
    mainRoutesPath = path.join("src/views/routes", "main.route.tsx");
  } else {
    mainRoutesPath = path.join("views/routes", "main.route.tsx");
  }

  if (fs.existsSync(mainRoutesPath)) {
    let mainRoutesContent = await fs.readFile(mainRoutesPath, "utf-8");

    const importStatement = `import ${name}Routes from './${name.toLowerCase()}.route';\n`;
    if (!mainRoutesContent.includes(importStatement)) {
      mainRoutesContent = importStatement + mainRoutesContent;
    }

    const newRoute = `<Route path="/${name.toLowerCase()}/*" element={<${name}Routes />} />`;
    if (!mainRoutesContent.includes(newRoute)) {
      const routesInsertionPoint = mainRoutesContent.indexOf("</Route>");
      mainRoutesContent =
        mainRoutesContent.slice(0, routesInsertionPoint) +
        `  ${newRoute}\n` +
        mainRoutesContent.slice(routesInsertionPoint);
    }

    await fs.writeFile(mainRoutesPath, mainRoutesContent, "utf-8");
    console.log(`Added ${name} route to main routes.`);
  } else {
    console.log("Main routes file not found.");
  }
};

const generateRoute = async (
  name,
  layoutName,
  hasLayout,
  addToMainRoutesOption,
  projectType,
  isApp,
  appName
) => {
  let routeDir;

  if (projectType === "nx") {
    routeDir = isApp
      ? path.join("apps", appName, "src/views/routes")
      : path.join("libs", appName, "src/routes");
  } else if (projectType === "normal") {
    routeDir = path.join("src/views/routes");
  } else {
    routeDir = path.join("");
  }

  const layoutImport = hasLayout
    ? `import ${layoutName} from "../layouts/${layoutName.toLowerCase()}.layout";\n`
    : "";
  const pageImport = `import ${name} from "../pages/${name}/${name}";\n`;

  const routeContent = `
import { Route, Routes } from "react-router-dom";
${layoutImport}${pageImport}

const ${name}Routes = () => {
  return (
    <Routes>
      ${hasLayout ? `<Route element={<${layoutName} />}>` : ""}
        <Route index element={<${name} />} />
      ${hasLayout ? `</Route>` : ""}
      <Route path="*" element={<div> Not Found </div>} />
    </Routes>
  );
};

export default ${name}Routes;
`;

  await fs.ensureDir(routeDir);
  await fs.writeFile(
    path.join(routeDir, `${name.toLowerCase()}.route.tsx`),
    routeContent
  );

  console.log(`Route ${name} created successfully in ${routeDir}!`);

  if (addToMainRoutesOption) {
    await addToMainRoutes(name, projectType, isApp, appName);
  }
};

module.exports = generateRoute;
