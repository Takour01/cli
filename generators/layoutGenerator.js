const fs = require("fs-extra");
const path = require("path");

const generateLayout = async (name, projectType, isApp, appName) => {
  let layoutDir;

  if (projectType === "nx") {
    layoutDir = isApp
      ? path.join("apps", appName, "src/views/layouts")
      : path.join("libs", appName, "src/layouts");
  } else if (projectType === "normal") {
    layoutDir = path.join("src/views/layouts");
  } else {
    layoutDir = path.join("");
  }

  // Simple layout file content with just the Outlet
  const layoutContent = `
import { Outlet } from "react-router-dom";

const ${name}Layout = () => {
  return <Outlet />;
};

export default ${name}Layout;
`;

  // Ensure the directory exists and create the layout file
  await fs.ensureDir(layoutDir);
  await fs.writeFile(path.join(layoutDir, `${name.toLowerCase()}.layout.tsx`), layoutContent);

  console.log(`Layout ${name} created successfully in ${layoutDir}!`);
};

module.exports = generateLayout;
