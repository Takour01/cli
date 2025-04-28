const fs = require("fs-extra");
const path = require("path");

const generateZodSchema = (name, attributes, isOptional = false) => {
  const zodSchema = attributes.map(
    (attr) => `${attr.attributeName}: ${isOptional ? attr.zodType + ".optional()" : attr.zodType},`
  );
  return `
export const ${name}Zod = z.object({
  ${zodSchema.join("\n  ")}
});
export type ${name}Type = z.infer<typeof ${name}Zod>;
`;
};

const generateInterface = async (name, projectType, isApp, appName, addAttributes, editAttributes, sameAsAdd) => {
  let interfaceDir;

  if (projectType === "nx") {
    interfaceDir = isApp
      ? path.join("apps", appName, "src/data/interfaces")
      : path.join("libs", appName, "src/interfaces");
  } else if (projectType === "normal") {
    interfaceDir = path.join("src/data/interfaces");
  } else {
    interfaceDir = path.join("");
  }

  // Initial state interface
  const initialStateContent = `
export interface ${name}InitialState {
  loading: boolean;
  error: string | null | unknown;
}
  `;

  // Generate Add schema if attributes exist
  let addSchema = "";
  if (addAttributes.length) {
    addSchema = generateZodSchema("Add" + name, addAttributes);
  }

  // Generate Edit schema
  let editSchema = "";
  if (sameAsAdd) {
    editSchema = generateZodSchema("Edit" + name, addAttributes, true);
  } else if (editAttributes.length) {
    editSchema = generateZodSchema("Edit" + name, editAttributes);
  }

  // Ensure the directory exists and create the interface file
  await fs.ensureDir(interfaceDir);
  await fs.writeFile(
    path.join(interfaceDir, `${name.toLowerCase()}.interface.ts`),
    `
${initialStateContent}
${addSchema}
${editSchema}
`
  );

  console.log(`Interface ${name} created successfully in ${interfaceDir}!`);
};

module.exports = generateInterface;
